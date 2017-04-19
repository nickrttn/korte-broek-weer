local request = {}

function request.get(host, path, callback)
	local sck = tls.createConnection()

	sck:on('connection', function(s)
		s:send(
			'GET ' .. path .. ' HTTP/1.0\r\n' ..
			'Connection: close\r\n' ..
			'Host: ' .. host .. '\r\n' ..
			'\r\n'
		)
	end)

	sck:on('receive', function(status, response)
		callback(response)
	end)

	sck:connect(443, host)
end

return request
