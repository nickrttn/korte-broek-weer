-- load credentials, 'SSID' and 'PASSWORD' declared and initialize in there
local wifimodule = require 'wifimodule'
local application = require 'application'
local colors = require 'colors'
local potmeter = require 'potmeter'

function startup()
    if file.open('init.lua') == nil then
        print('init.lua deleted or renamed')
    else
        file.close('init.lua')
        sntp.sync(nil, nil, nil, 1)
        -- the actual application is stored in 'application.lua'
        dofile('application.lua')
--        Als dit de application.lua moet starten doet ie het niet
    end
end

ws2812.init(ws2812.MODE_SINGLE)
wifimodule.connect(startup)
