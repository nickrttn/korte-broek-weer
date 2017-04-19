-- load credentials, 'SSID' and 'PASSWORD' declared and initialize in there
-- dofile('credentials.lua')
local wifimodule = require 'wifimodule'

function startup()
		print('startup called')
    if file.open('init.lua') == nil then
        print('init.lua deleted or renamed')
    else
        print('Running')
        file.close('init.lua')

        -- the actual application is stored in 'application.lua'
        dofile('application.lua')
    end
end

ws2812.init(ws2812.MODE_SINGLE)
wifimodule.connect(startup)
