local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

type Contents = { [string | number]: any } | { any }

type InitialPacket = {
    id: string,
	to: { Player },
	contents: Contents,
}

type Packet = {
    id: string,
	contents: Contents,
}

type Listener = (player: Player, contents: Contents) -> any

local Server = {}

local Queue: { InitialPacket }  = {}
local Listeners: { Listener } = {}

local function runListener(listener: Listener, ...: { Player | Contents })
    task.spawn(listener, ...)
end

function Server._init(): nil
    local TinaRemote = Instance.new("RemoteEvent", ReplicatedStorage)
    TinaRemote.Name = "TinaRemote"

    RunService.PostSimulation:Connect(function()
        for _, packet: InitialPacket in Queue do
            for _, player in packet.to :: { Player } do
                TinaRemote:FireClient(player, {
                    contents = packet.contents,
                    id = packet.id,
                } :: Packet) -- Fires remote, nothing needs to be cached?
            end
        end

        Queue = {} -- Frees everything
    end)

    TinaRemote.OnServerEvent:Connect(function(player: Player, packets: { Packet })
        for _, packet: Packet in packets do
            for _, listener: Listener in Listeners[packet.id] do
                runListener(listener, player, packet.contents)
            end
        end
    end)
end

function Server.send(id: string, player: { Player }, contents: Contents): nil
    table.insert(Queue, {
        id = id,
        to = player,
        contents = contents,
    })
end

function Server.sendAll(id: string, contents: Contents): nil
    local to: { Player } = Players:GetPlayers()

    table.insert(Queue, {
        id = id,
        to = to,
        contents = contents,
    })
end

function Server.sendAllExcept(id: string, blacklist: { Player }, contents: Contents): nil
    local blacklistMap: { [Player]: boolean } = {}

    for player in blacklist do
        blacklistMap[player] = true
    end

    local to = Server._getWhitelisted(blacklistMap)

    table.insert(Queue, {
        id = id,
        to = to,
        contents = contents,
    })
end

function Server.listen(id: string, callback: Listener): nil
    if not Listeners[id] then
        Listeners[id] = { callback }
    else
        table.insert(Listeners[id], callback)
    end
end

function Server._getWhitelisted(list: { [Player]: boolean }): { Player }
    local to: { Player } = {}

    for _, player in Players:GetPlayers() do
        if not list[player] then
            table.insert(to, player)
        end
    end

    return to
end

return Server