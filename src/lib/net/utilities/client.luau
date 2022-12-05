local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

type Contents = { [string | number]: any } | { any }

type Packet = {
    id: string,
	contents: Contents,
}

type Listener = (contents: Contents) -> any

local Client = {}

local Queue: { Packet }  = {}
local Listeners: { Listener } = {}

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

function Client._init()
    local TinaRemote: RemoteEvent = ReplicatedStorage:WaitForChild("TinaRemote") :: RemoteEvent

    RunService.PostSimulation:Connect(function()
        local packetToSend: { Packet } = {}

        for _, packet: Packet in Queue do
            table.insert(packetToSend, packet)
        end

        TinaRemote:FireServer(packetToSend)

        Queue = {}
    end)

    TinaRemote.OnClientEvent:Connect(function(packet: Packet)
        for _, listener: Listener in Listeners[packet.id] do
            if not freeThread then
                freeThread = coroutine.create(runEventHandlerInFreeThread)
            end

            task.spawn(freeThread, listener, packet.contents)
        end
    end)
end

function Client.send(id: string, contents: Contents): nil
    table.insert(Queue, {
        id = id,
        contents = contents,
    })
end

function Client.listen(id: string, callback: Listener)
    if not Listeners[id] then
        Listeners[id] = { callback }
    else
        table.insert(Listeners[id], callback)
    end
end

return Client