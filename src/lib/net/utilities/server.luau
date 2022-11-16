local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local identifiers = require(script.Parent.identifiers)

type packet = {
	to: { Player } | Player | "all",
	id: string,
	contents: { any },
}

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

local server = {}

local listenerMap = {}
local waiting = {}
local validBridges = {}
local queue: { packet } = {}

function server._init()
	local remote = Instance.new("RemoteEvent")
	remote.Name = "tinaRemote"
	remote.Parent = ReplicatedStorage

	RunService.PostSimulation:Connect(function()
		local startTime = os.clock()
		local sendStructure: { [Player]: { [string]: { string | any } } } = {}

		for _, v: packet in queue do
			local toType = typeof(v.to)
			if toType == "string" then
				for _, plr in Players:GetPlayers() do
					table.insert(sendStructure[plr][v.id], v.contents)
				end
			elseif toType == "table" then
				for _, plr in v.to :: { Player } do
					table.insert(sendStructure[plr][v.id], v.contents)
				end
			else
				table.insert(sendStructure[v.to :: Player][v.id], v.contents)
			end
		end
		table.clear(queue)

		local finishTime = os.clock() - startTime
		if finishTime >= 0.001 then
			-- TODO debug warn later
		end
	end)

	remote.OnServerEvent:Connect(function(plr, ...)
		local arr = { ... }

		if typeof(arr[1]) ~= "table" or #arr > 1 then
			return plr -- kick / ban player later
		end

		for _, v in arr[1] do
			local id = v[1]
			table.remove(v, 1)

			if not listenerMap[id] then
				continue
			end

			if #waiting[id] > 0 then
				for _, thread in waiting do
					coroutine.resume(thread, table.unpack(arr))
				end
			end

			for _, callback in listenerMap[id] do
				runCallback(callback, plr, table.unpack(arr))
			end
		end

		return
	end)
end

function server.create(name: string)
	local id = identifiers.createIdentifier(name)
	validBridges[id] = true
	return id
end

function server.call(plr: Player | { Player } | "all", id: string, ...: any)
	if not validBridges[id] then
		return warn("id isn't a valid bridge")
	end

	table.insert(queue, {
		to = plr,
		id = id,
		contents = { ... },
	})

	return
end

function server.waitFor(identifier: string)
	if not waiting[identifier] then
		waiting[identifier] = {}
	end
	table.insert(waiting[identifier], coroutine.running())
	return coroutine.yield()
end

function server.listen(identifier: string, func: (...any) -> nil)
	if not validBridges[identifier] then
		return warn("id isn't a valid bridge")
	end

	if listenerMap[identifier] == nil then
		listenerMap[identifier] = { func }
	else
		table.insert(listenerMap, func)
	end

	return
end

return server
