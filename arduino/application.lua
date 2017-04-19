local request = require 'request'

buffer = ws2812.newBuffer(8, 3)

function parse(body)
	local json = body:sub(body:find("{"), body:len())
	return cjson.decode(json)
end

function setColor(color)
	for i=1,buffer:size() do
		buffer:set(i,
			string.char(
				tonumber(color["g"]),
				tonumber(color["r"]),
				tonumber(color["b"])
			)
		)
	end

	ws2812.write(buffer)
end

function handleResponse(body)
	local color = parse(body)
	setColor(color)
end

request.get('korte-broek-weer.herokuapp.com', '/api', handleResponse)
