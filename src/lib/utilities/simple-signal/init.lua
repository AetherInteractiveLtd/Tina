--------------------------------------------------------------------------------
--                  Simple Correct Signal Implementation                      --
-- This is the most straightforwards possible pure Lua implementation of a    --
-- Signal class that correctly implements all of the RBXScriptSignal          --
-- behavior (Connect, Disconnect, and Wait)                                   --
--------------------------------------------------------------------------------
local Signal = {}
Signal.__index = Signal

local Connection = {}
Connection.__index = Connection

function Connection.new(signal, handler)
	return setmetatable({
		_handler = handler,
		_signal = signal,
	}, Connection)
end

function Connection:Disconnect()
	local signal = self._signal
	local index = table.find(signal, self)
	if index then
		table.remove(signal, index)
	end
end

function Signal.new()
	return setmetatable({}, Signal)
end

function Signal:Connect(fn)
	local handler = Connection.new(self, fn)
	table.insert(self, handler)
	return handler
end

function Signal:DisconnectAll()
	table.clear(self)
end

function Signal:Fire(...)
	local handlersCount = #self
	local handlersCopy
	if handlersCount > 0 then
		handlersCopy = table.create(handlersCount)
		table.move(self, 1, handlersCount, 1, handlersCopy)
		for i = handlersCount, 1, -1 do
			task.spawn(handlersCopy[i]._handler, ...)
		end
	end
end

function Signal:Wait()
	local waitingCoroutine = coroutine.running()
	local cn;
	cn = self:Connect(function(...)
		cn:Disconnect()
		task.spawn(waitingCoroutine, ...)
	end)
	return coroutine.yield()
end

function Signal:Once(fn)
	local cn;
	cn = self:Connect(function(...)
		cn:Disconnect()
		fn(...)
	end)
	return cn
end

return Signal
