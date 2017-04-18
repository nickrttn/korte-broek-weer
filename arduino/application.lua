-- Initialise
ws2812.init()
buffer = ws2812.newBuffer(8, 3)

http.get('http://95.85.50.81',
	nil,
	function(status, data)
		print(status)
		print(data)
	end
)

for i=2,buffer:size() do
	buffer:set(i, string.char(255, 127, 0));
end

ws2812.write(buffer)
