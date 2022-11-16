local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local client = {}

type packet = {
	id: string,
	contents: { any },
}

local identifierMap = {}
local waiting = {}
local queue = {}

local freeThread = nil

local function runThreadCallback(callback, ...)
	local thisThread = freeThread
	freeThread = nil
	callback(...)
	freeThread = thisThread
end

local function yieldAndRunThread()
	while true do
		runThreadCallback(coroutine.yield())
	end
end

local function runCallback(callback, ...)
	if not freeThread then
		local thread = coroutine.create(yieldAndRunThread)
		coroutine.resume(thread, ...)
	else
		task.spawn(freeThread, callback, ...)
	end
end

function client._init()
	local RemoteEvent: RemoteEvent = ReplicatedStorage:WaitForChild("tinaRemote")

	RunService.PostSimulation:Connect(function()
		local start = os.clock()

		local toSend = {}
		for _, v: packet in queue do
			table.insert(toSend, {
				v.id,
				table.unpack(v.contents),
			})
		end

		RemoteEvent:FireServer(toSend)
		table.clear(queue)

		local finish = os.clock()

		if finish - start > 0.001 then
			-- TODO warn
		end
	end)

	RemoteEvent.OnClientEvent:Connect(function(data)
		for identifier, value in data do
			for _, v in identifierMap[identifier] do
				runCallback(v, table.unpack(value))
			end
		end
	end)
end

function client.listen(identifier: string, callback: (...any) -> nil)
	table.insert(identifierMap[identifier], callback)
end

function client.call(identifier: string, ...)
	local contents = { ... }
	table.insert(queue, {
		id = identifier,
		contents = contents,
	})
end

function client.waitfor(identifier: string)
	if not waiting[identifier] then
		waiting[identifier] = {}
	end
	table.insert(waiting[identifier], coroutine.running())
	return coroutine.yield()
end

return client
