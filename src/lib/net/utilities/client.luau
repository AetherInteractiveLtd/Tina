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

local function runListener(listener: Listener, ...: { Contents })
    task.spawn(listener, ...)
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
            runListener(listener, packet.contents)
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