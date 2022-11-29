--[[ Code source from BridgeNet RC, authorised for use by license holder. ]]

--!strict
local ReplicatedStorage: ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService: RunService = game:GetService("RunService")

local receiveDict: { [string]: string? } = {}
local sendDict: { [string]: string? } = {}
local numOfSerials: number = 0

local Identifiers = {}

local AutoSerde: Folder = nil
local isServer = RunService:IsServer()

type toSend = string

function Identifiers._init()
	if RunService:IsClient() then
		AutoSerde = ReplicatedStorage:WaitForChild("Identifier") :: Folder

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
		AutoSerde.Name = "Identifier"
		AutoSerde.Parent = ReplicatedStorage
	end
end

function Identifiers.createIdentifier(id: string): string
	assert(type(id) == "string", "ID must be a string")

	if not sendDict[id] and not isServer then
		return Identifiers.waitForIdentifier(id)
	elseif sendDict[id] and not isServer then
		return sendDict[id] :: string
	end

	assert(numOfSerials <= 65536, "Over the identification cap: " .. id)
	numOfSerials += 1

	local packed: string = string.pack("H", numOfSerials)
	AutoSerde:SetAttribute(id, packed)

	sendDict[id] = packed
	receiveDict[packed] = id

	return packed
end

function Identifiers.waitForIdentifier(id: string): string
	local identifier = sendDict[id] or (if AutoSerde.Parent ~= nil then AutoSerde:GetAttribute(id) else nil)

	if (identifier) then
		return identifier
	else
		task.delay(2, function()
			warn("Infinite yield. ID: ", id)
		end)

		repeat
			identifier = sendDict[id] or (if AutoSerde.Parent ~= nil then AutoSerde:GetAttribute(id) else nil)
		until identifier ~= nil

		return identifier
	end
end

function Identifiers.fromCompressed(compressed: string)
	return receiveDict[compressed]
end

function Identifiers.fromIdentifier(identifier: string)
	return sendDict[identifier]
end

return Identifiers
