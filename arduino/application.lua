-- local request = require 'request'

-- buffer = ws2812.newBuffer(8, 3)

-- function parse(body)
-- 	print(body)

-- 	local json = body:sub(body:find("{"), body:len())
-- 	local t = cjson.decode(json)

-- 	for k,v in pairs(t) do
-- 		t[k] = tonumber(v)
-- 	end

-- 	return t
-- end

-- function setColor(clr)
-- 	print(clr)
-- 	if full == true then
-- 		buffer:fill(string.char(clr["g"], clr["r"], clr["b"]))
-- 	else
-- 		for i=1,buffer:size()/2 do
-- 			buffer:set(i, string.char(clr["g"], clr["r"], clr["b"]))
-- 		end
-- 	end

-- 	ws2812.write(buffer)
-- end

-- function handleResponse(res)
-- 	local clr = parse(res)
-- 	setColor(clr, false)
-- end

print('Box ID: ' .. node.chipid())

-- request.get(
-- 	'korte-broek-api.herokuapp.com',
-- 	'/user/' .. node.chipid(),
-- 	handleResponse
-- )
