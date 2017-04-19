-- Initialise
buffer = ws2812.newBuffer(8, 3)

function request(host, path)
    local sck = tls.createConnection()
    sck:on('connection', function(s)
        print('CONN')
        s:send(
            'GET ' .. path .. ' HTTP/1.0\r\n' ..
            'Connection: close\r\n' ..
            'Host: ' .. host .. '\r\n' ..
            '\r\n'
        )
    end)
    sck:on('receive', function(s, d)
        local color = parse(d)
        setColor(color)
    end)
    sck:on('disconnection', function(s)
        print('CLOSE')
    end)
    sck:on('reconnection', function(s, e)
        print('ERR', e)
    end)
    sck:connect(443, host)
end

function parse(body)
	local json = body:sub(body:find("{"), body:len())
	return cjson.decode(json)
end

-- http.get('https://korte-broek-weer.herokuapp.com/api',
-- 	nil,
-- 	function(status, json)
-- 		print(status)
-- 		print(json)
-- 		-- color = cjson.decode(json)
-- 		-- setColor(color)
-- 	end
-- )

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

request('korte-broek-weer.herokuapp.com', '/api');
