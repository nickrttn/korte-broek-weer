local request = require 'request'

buffer = ws2812.newBuffer(8, 3)

function parse(body)
	local json = body:sub(body:find("{"), body:len())
	local t = cjson.decode(json)

	for k,v in pairs(t) do
		t[k] = tonumber(v)
	end

	return t
end

function setColor(clr)
	for i=1,buffer:size() do
		buffer:set(i, string.char(clr["g"], clr["r"], clr["b"]))
	end

	ws2812.write(buffer)
end

function handleResponse(res)
	local clr = parse(res)
	setColor(clr)
end

request.get(
	'korte-broek-weer.herokuapp.com',
	'/api',
	handleResponse
)
