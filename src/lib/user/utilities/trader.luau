-- CONFIGURATION VARIABLES
local CONFIGURATION = {
	DataStoreAttempts = 3,

	DataStoreWriteCooldown = 10,
	AutoSaveTime = 30, -- Every minute

}

local AutoSaveList = {}
local AutoSaveIndex = 1
local LastAutoSave = os.time()

local LoadIndex = 0
local NotLocked = false

local APIServicesActive = false
local DataStoreService = game:GetService("DataStoreService")

local RunService = game:GetService("RunService")

-- TYPES
type Shop = {
	key: string,

	_template: Template,
	_customers: {}, -- array of customers

	_global_data_store: GlobalDataStore
}

type Connection = {
	__listener: () -> nil,

	__signal: Signal,
	__next: Signal,

	__is_active: boolean,

	disconnect: () -> nil,
}

type Signal = {
	fire: (self: {}, args: { any }) -> any,
	listen: (self: {}, callback: () -> any) -> Connection,

	__head: Signal,
}

type Template = { [string | number]: any }
type Metadata = {
	lastTimeConnection: number,
	version: number,
	creationTimeStamp: number,

	_shop_subscribed_to: Shop,
}

type DataToSave = {
	_metadata: Metadata,
	data: Template,
}

type Customer = {
	data: Template,
	metadata: Metadata,
	userIds: {}, -- GDPR compliances

	keyInfo: {
		currentKeyCreationTime: number,
		version: number,
		updatedTime: number,
	},

	_shop_subscribed_to: Shop,
	_customer_key: string,

	-- Signals
	_loaded: Signal,
	_releasing: Signal,
}

-- FAST SIGNAL IMPLEMENTATION
local FastSignal: Signal
do
	-- Some fast implementation of FastSignal with thread reusage for the issues, saves, etc. Everything that may rely on signals.
	local freeThread = nil

	local function acquireRunnerThreadAndCallEventHandler(fn, ...)
		local acquired_runner_thread = freeThread
		freeThread = nil

		fn(...)

		freeThread = acquired_runner_thread
	end

	local function runEventHandlerInFreeThread(...)
		acquireRunnerThreadAndCallEventHandler(...)

		while true do
			acquireRunnerThreadAndCallEventHandler(coroutine.yield())
		end
	end

	local Connection: Connection = {}
	Connection.__index = Connection

	function Connection:disconnect(): nil
		if not self.__is_active then return end

		self.__is_active = false

		if self.__signal.__head == self then
			self.__signal.__head = self.__next
		else
			local prev = self.__signal.__head

			while prev ~= nil and prev.__next ~= self do
				prev = prev.__next
			end

			if prev ~= nil then
				prev.__next = self.__next
			end
		end
	end

	FastSignal = {}
	FastSignal.__index = FastSignal

	function FastSignal.new(): Signal
		return {
			__head = nil,

			listen = FastSignal.listen,
			fire = FastSignal.fire,
		}
	end

	function FastSignal:listen(callback: () -> any): Connection
		local connection: Connection = {
			__listener = callback,
			__is_active = true,

			__signal = self,
			__next = self.__head
		}

		self.__head = connection
		setmetatable(connection, Connection)

		return connection
	end

	function FastSignal:fire(...): nil
		local element = self.__head

		while element ~= nil do
			if not element.__is_active then continue end

			if not freeThread then
				freeThread = coroutine.create(runEventHandlerInFreeThread)
			end

			task.spawn(freeThread, element.__listener, ...)

			element = element.__next
		end
	end
end

-- UTILITY FUNCTIONS
local function deepCopy(t)
	local copy = {}

	for k, v in t do
		if type(v) == "table" then
			deepCopy(v)
		else
			copy[k] = v
		end
	end

	return copy
end

local function reconcile(t, template)
	for k, v in template do
		if t[k] == nil then
			if type(v) == "table" then
				t[k] = deepCopy(v)
			else
				t[k] = v
			end
		elseif type(t[k]) == "table" and type(template[k]) == "table" then
			reconcile(t[k], v)
		end
	end
end

local function addCustomerToAutoSave(customer)
	table.insert(AutoSaveList, customer)

	if #AutoSaveList > 1 then
		AutoSaveIndex += 1
	elseif #AutoSaveList == 1 then
		LastAutoSave = os.clock()
	end
end

local function removeCustomerFromAutoSave(customer)
	local foundCustomerIndex = table.find(AutoSaveList, customer)

	if foundCustomerIndex then
		table.remove(AutoSaveList, foundCustomerIndex)

		if foundCustomerIndex < AutoSaveIndex then
			AutoSaveIndex -= 1
		end

		if not AutoSaveList[AutoSaveIndex] then
			AutoSaveIndex = 1
		end
	end
end

-- DATASTORE WRAPPER
local Trader;
local SafeDataStoreWrapper: DataStoreWrapper;
do
	local queue: {
		[string]: { -- shop key
			[string]: { -- customer key
				queue: {}, -- array
				lastWrite: number,
				cleanup: RBXScriptConnection | nil,
			}
		}
	} = {}

	local function cleanQueue(shop_key, customer_key)
		local queueData = queue[shop_key][customer_key]

		if not queueData then
			queueData.cleanup = RunService.PostSimulation:Connect(function(deltaTimeSim)
				if (os.clock() - queueData.lastWrite) > CONFIGURATION.DataStoreWriteCooldown and #queue == 0 then
					queueData.cleanup:Disconnect()
					cleanQueue(shop_key, customer_key)
				end
			end)
		end
	end

	local function queueAsync(callback: () -> nil, shop_key: string, customer_key: string)
		if not queue[shop_key] then
			queue[shop_key] = {}
		end

		if not queue[shop_key][customer_key] then
			queue[shop_key][customer_key] = { lastWrite = 0, queue = {} }
		end

		local queueData = queue[shop_key][customer_key]

		if queueData.cleanup then
			queueData.cleanup:Disconnect()
			queueData.cleanup = nil
		end

		local lastTime = queueData.lastWrite

		if (os.clock() - lastTime) > CONFIGURATION.DataStoreWriteCooldown and #queue == 0 then
			queueData.lastWrite = os.clock()

			return callback()
		else
			table.insert(queue, callback) -- Queue

			while true do
				if (os.clock() - lastTime) > CONFIGURATION.DataStoreWriteCooldown and queue[1] == callback then
					table.remove(queue, 1)
					queueData.lastWrite = os.clock()

					return callback()
				end
			end
		end
	end

	local function dataStoreCallAsync(customer_key, customer_shop, methods, is_get_call, version)
		local loadedData, keyInfo -- We use the DataStoreKeyInfo for metadata purposes really
		local success, errorMessage = pcall(function()
			local callback = function(last_data_saved)
				local nonData = false

				if last_data_saved and type(last_data_saved) ~= "table" then
					nonData = true
					Trader._issue_signal:fire(customer_key .. customer_shop._shop_key, "Last saved data may be corrupted!")
				elseif last_data_saved == nil then
					nonData = true
				end

				if not nonData and type(last_data_saved) == "table" and type(last_data_saved.data) == "table" and type(last_data_saved.metadata) == "table" then
					if methods and methods.loadedCustomer then
						methods.existingCustomer(last_data_saved)
					end
				end

				if nonData then
					last_data_saved = {}
					methods.missingCustomer(last_data_saved)
				end

				return last_data_saved
			end

			do
				loadedData, keyInfo = queueAsync(
					function()
						if is_get_call then -- Retrieve
							local getData, getKeyInfo

							if version then
								local retrieveVersion = function()
									getData, getKeyInfo = customer_shop._global_data_store:GetVersionAsync(customer_key, version)
								end

								local success, errorMessage = pcall(retrieveVersion)

								if not success and type(errorMessage) == "string" then
									Trader._issue_signal:fire(string.format("%s_%s", customer_key, customer_shop._shop_key), errorMessage)
								end
							else
								getData, getKeyInfo = customer_shop._global_data_store:GetAsync(customer_key)
							end

							return getData, getKeyInfo
						else -- Update
							return customer_shop._global_data_store:UpdateAsync(customer_key, callback)
						end
					end,
					customer_shop._shop_key,
					customer_key
				)
			end
		end)

		if success and type(loadedData) == "table" then -- We save a whole table, so it is required to check for that corruption
			return loadedData, keyInfo
		elseif not success and type(errorMessage) == "string" then
			Trader._issue_signal:fire(
				string.format("%s_%s", customer_key, customer_shop._shop_key),
				errorMessage ~= nil and errorMessage or "Unexpected error."
			)
		end
	end

	local function releaseCustomer(customer_key: string, customer: Customer)
		local shop = customer._shop_subscribed_to
		local loadedCustomers = shop._customers

		loadedCustomers[customer_key] = nil -- Remove it from active customers

		removeCustomerFromAutoSave(customer)

		-- Signals for customer
		customer._releasing:fire()
	end

	SafeDataStoreWrapper = {}

	SafeDataStoreWrapper.dataStoreCallAsync = dataStoreCallAsync
	SafeDataStoreWrapper.release = releaseCustomer
end

local Customer: Customer;

Customer = {}
Customer.__index = Customer
Customer.__tostring = function(self)
	return self.key .. self.subscribedShop
end

function Customer:addUserId(userId: number)
	assert(type(userId) == "number", "[Customer]: Can't give string userIds, give a number!")
	assert(userId > 0, "[Customer]: Can't give negative user ids.")

	if table.find(self.userIds, userId) then return end

	table.insert(self.userIds, userId)
end

function Customer:removeUserId(userId: number)
	assert(type(userId) == "number", "[Customer]: Can't give string userIds, give a number!")
	assert(userId > 0, "[Customer]: Negative user ids doesn't exist within.")

	local found = table.find(self.userIds, userId)

	if found then table.remove(self.UserIds, found) end
end

function Customer:reconcile()
	reconcile(self.data, self._shop_subscribed_to._template)
end

function Customer:release()
	task.spawn(SafeDataStoreWrapper.dataStoreCallAsync, self.customer_key, self._shop_subscribed_to)

	SafeDataStoreWrapper.release(self.customer_key, self)

	-- Final signal
	self._releasing:listen()
end

function Customer:onRelease(func: () -> nil): Connection
	return self._releasing:listen(func)
end

function Customer:onLoad(func: () -> nil): Connection
	return self._loaded:listen(func)
end

local Shop = {};
Shop.__index = Shop;

function Shop:subscribeCustomer(customer_key: string): nil
	assert(typeof(customer_key) == "string" or string.len(customer_key) ~= 0, "Customer's key can't be other than a string (n > 0 characters long).")

	if not self._template then
		Trader._issue_signal:fire(customer_key, "A template wasn't defined. Please make sure to define a template.")
	end

	if (self._customers[customer_key]) then
		Trader._issue_signal:fire(customer_key, "This profile has been already loaded.")

		return
	end

	while not NotLocked do
		local loadedData, keyInfo: DataStoreKeyInfo
		local loadJobs = self._customer_load_jobs
		local id =  LoadIndex + 1

		LoadIndex = id -- For loading jobs, so they're queued and not done directly

		local loadJob = loadJobs[customer_key]

		if loadJob then
			loadJob.id = id

			while loadJob.data_saved == nil do
				task.wait()
			end

			if loadJob.id == id then
				loadedData, keyInfo = table.unpack(loadJob.data_saved)
				self._customer_load_jobs[customer_key] = nil
			end
		else
			loadJob = { id = id, data_saved = nil }
			self._customer_load_jobs = loadJob

			loadJob.data_saved = {
				SafeDataStoreWrapper.dataStoreCallAsync(
					customer_key,
					self,
					{
						existingCustomer = function(latest_data)
							
						end,

						missingCustomer = function(latest_data)
							latest_data.data = deepCopy(self._template)

							latest_data.metadata = {
								lastTimeConnection = os.time(),
								version = 1,
								creationTimeStamp = os.time(),

								_shop_subscribed_to = self._shop_key,
							}

							latest_data.userIds = {}
						end
					}
				)
			}

			if loadJob.id == id then
				loadedData, keyInfo = table.unpack(loadJob.data_saved)
				self._customer_load_jobs[customer_key] = nil
			end
		end

		if loadedData and keyInfo then
			local customer: Customer = {
				data = loadedData.data,
				metadata = loadedData.metadata,
				userIds = loadedData.userIds or {}, -- GDPR compliances

				keyInfo = {
					currentKeyCreationTime = keyInfo.CreatedTime,
					version = keyInfo.Version,
					updatedTime = keyInfo.UpdatedTime,
				},

				_shop_subscribed_to = self,
				_customer_key = customer_key,

				-- Signals
				_loaded = FastSignal.new(),
				_releasing = FastSignal.new(),

				_load_timestamp = os.clock()
			}

			addCustomerToAutoSave(customer)
			setmetatable(customer, Customer)

			return customer
		else
			task.wait()
		end
	end
end

Trader = {
	_active_shops = {},
	_issue_signal = FastSignal.new(),

	-- Bind to close
	onGameClose = function(task: () -> nil) -- Heavily inspired by ProfileService because i liked it's syntax lol
		if RunService:IsStudio() == false or APIServicesActive == true then
			game:BindToClose(task)
		end
	end
}

function Trader.getShop(key: string, template: Template)
	local self = {
		_shop_key = key,

		_template = template,
		_customers = {}, -- { [customer_key]: data_saved }

		_global_data_store = DataStoreService:GetDataStore(key),

		_customer_load_jobs = {}, -- Queue loading, this avoids players rejoining fast enough to make the loading break
	}

	table.insert(Trader._active_shops, self)

	return setmetatable(self, Shop)
end

-- Trader's connection's
do
	Trader._issue_signal:listen(function(customer: Customer, errorMessage: string)
		warn(string.format("[Trader (DataStore)]: There was a problem with a customer [%s], error: %s.", tostring(customer), errorMessage))
	end)
end

-- Connections and others
do
	task.spawn(function()
		NotLocked = false

		-- Check for API services
		if RunService:IsStudio() then
			local success, errorMessage = pcall(function()
				DataStoreService:GetDataStore("_TESTING_FOR_LIVE"):SetAsync("___TESTING_KEY", os.time())
			end)

			-- This was some clever way of doing it by ProfileService
			local noInternet = not success and string.find(errorMessage, "ConnectFail", 1, true)

			if noInternet then
				warn("[NO INTERNET CONNECTION]: Check your network to use the DataStore services.")
			elseif not success and string.find(errorMessage, "403") then
				warn("[API SERVICES UNAVAILABLE]: Enable API services to use the DataStore services.")
			elseif not success and string.find(errorMessage, "must publish", 1, true) then
				warn("[GAME NEEDS TO BE PUBLISHED]: Make sure to publish the game before using any data store methods.")
			end
		end
	end)

	RunService.PostSimulation:Connect(function()
		local autoSaveListLength = #AutoSaveList
		if autoSaveListLength > 0 then
			local saveSpeed = CONFIGURATION.AutoSaveTime / autoSaveListLength
			local os_clock = os.clock()
			while os_clock - LastAutoSave > saveSpeed do
				LastAutoSave += saveSpeed

				local customer = AutoSaveList[AutoSaveIndex]

				if (os_clock - customer._load_timestamp) < CONFIGURATION.AutoSaveTime then
					customer = nil

					for _ = 1, autoSaveListLength - 1 do
						AutoSaveIndex = AutoSaveIndex + 1

						if AutoSaveIndex > autoSaveListLength then
							AutoSaveIndex = 1
						end

						customer = AutoSaveList[AutoSaveIndex]
						if os_clock - customer._load_timestamp >= CONFIGURATION.AutoSaveTime then
							break
						else
							customer = nil
						end
					end
				end

				AutoSaveIndex = AutoSaveIndex + 1
				if AutoSaveIndex > autoSaveListLength then
					AutoSaveIndex = 1
				end

				if (customer ~= nil) then
					SafeDataStoreWrapper.dataStoreCallAsync(customer._customer_key, customer._shop_subscribed_to)
				end
			end
		end
	end)

	task.spawn(function()
		Trader.onGameClose(
			function()
				-- Save of the multiple Customers
				NotLocked = true
			end
		)
	end)
end

return {
	Trader = Trader,
}