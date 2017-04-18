-- Initialise
buffer = ws2812.newBuffer(8, 3)

http.get('http://95.85.50.81/api',
	nil,
	function(status, json)
		color = cjson.decode(json)
		setColor(color)
	end
)

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
