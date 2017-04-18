-- Initialise
ws2812.init()
buffer = ws2812.newBuffer(8, 3)

http.get('http://95.85.50.81/api',
	nil,
	function(status, json)
		print(json)

		color = cjson.decode(json)

		for k,v in pairs(color) do
			color[k] = tonumber(v)
		end

		print(string.char(color["g"], color["r"], color["b"]))

		-- for i=1,buffer:size() do
		-- 	buffer:set(i,
		-- 		string.char(color["g"], color["r"], color["b"])
		-- 	);
		-- end

		-- ws2812.write(buffer)
	end
)

function()

end
