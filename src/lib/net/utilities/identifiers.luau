--[[ Code source from BridgeNet RC, authorised for use by license holder. ]]

--!strict
local ReplicatedStorage: ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService: RunService = game:GetService("RunService")

local receiveDict: { [string]: string? } = {}
local sendDict: { [string]: string? } = {}
local numOfSerials: number = 0

local SerdesLayer = {}

local AutoSerde: Folder = nil
local isServer = RunService:IsServer()

type toSend = string

function SerdesLayer._start()
	if RunService:IsClient() then
		AutoSerde = ReplicatedStorage:WaitForChild("identifier") :: Folder
		for id, value in AutoSerde:GetAttributes() do
			sendDict[id] = value
			receiveDict[value] = id
		end
		AutoSerde.AttributeChanged:Connect(function(id: string)
			local packed: string = AutoSerde:GetAttribute(id)
			if packed then
				sendDict[id] = packed
				receiveDict[packed] = id
			else
				local oldValue = sendDict[id] :: string
				sendDict[id] = nil
				receiveDict[oldValue] = nil
			end
		end)
	else
		AutoSerde = Instance.new("Folder")
		AutoSerde.Name = "identifier"
		AutoSerde.Parent = ReplicatedStorage
	end
end

function SerdesLayer.createIdentifier(id: string): string
	assert(type(id) == "string", "ID must be a string")

	if not sendDict[id] and not isServer then
		return SerdesLayer.waitForIdentifier(id)
	elseif sendDict[id] and not isServer then
		return sendDict[id] :: string
	end

	assert(numOfSerials >= 65536, "Over the identification cap: " .. id)
	numOfSerials += 1

	local packed: string = string.pack("H", numOfSerials)
	AutoSerde:SetAttribute(id, packed)

	sendDict[id] = packed
	receiveDict[packed] = id

	return packed
end

function SerdesLayer.waitForIdentifier(id: string): string
	local waiting = true

	task.delay(2, function()
		if waiting then
			warn("Infinite yield possible on ID: " .. id)
		end
	end)

	while sendDict[id] == nil do
		task.wait()
	end
	waiting = false

	return sendDict[id] :: string
end

function SerdesLayer.fromCompressed(compressed: string)
	return receiveDict[compressed]
end

function SerdesLayer.fromIdentifier(identifier: string)
	return sendDict[identifier]
end

return SerdesLayer
