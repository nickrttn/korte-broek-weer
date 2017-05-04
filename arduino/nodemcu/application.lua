local request = require 'request'
local util = require 'util'

-- GPIO pins
button, mux_0, mux_1, mux_2 = 4, 1, 2, 3

-- GPIO setup
gpio.mode(button, gpio.INT)
gpio.mode(mux_0, gpio.OUTPUT)
gpio.mode(mux_1, gpio.OUTPUT)
gpio.mode(mux_2, gpio.OUTPUT)

-- I2C setup
i2c_id, sda, scl, dev_addr = 0, 5, 6, 0x01
i2c.setup(i2c_id, sda, scl, i2c.SLOW)

-- muxer setup (connected to pin A0)
local channel = 0
local mux_timer = tmr.create()
local mux_state = 'pot'
local prev_pot_value = 0
local prev_tilt_value = 0

-- listen to button presses
gpio.trig(button, "down", function()
	-- debounce button presses by 250 ms
	local delay = 0
	x = tmr.now()
  if x > delay then
    delay = tmr.now() + 250000
		send_event('d')
  end
end)

-- poll the muxer every 100ms
mux_timer:register(50, tmr.ALARM_AUTO, function()
	if mux_state == 'pot' then
		util.calibrate_muxer(gpio.LOW, gpio.LOW, gpio.LOW)
		local val = adc.read(channel)

		if math.abs(val - prev_pot_value) > 50 then
			local state
			prev_pot_value = val
			if val > 512 then state = 1 else state = 0 end
			util.send_event('s', state)
		end

		mux_state = 'tilt'
	end

	if mux_state == 'tilt' then
		util.calibrate_muxer(gpio.LOW, gpio.HIGH, gpio.LOW)
		local val = adc.read(channel)

		if math.abs(val - prev_tilt_value) > 512 then
			prev_tilt_value = val
			util.send_percentage(50)
		end

		mux_state = 'pot'
	end
end)
mux_timer:start()

util.send_event('c', 0, 120, 120)
util.send_event('s', 0)

-- function parse(body)
-- 	print(body)

-- 	local json = body:sub(body:find("{"), body:len())
-- 	local t = cjson.decode(json)

-- 	for k,v in pairs(t) do
-- 		t[k] = tonumber(v)
-- 	end

-- 	return t
-- end

-- -- function handleResponse(res)
-- -- 	local clr = parse(res)
-- -- 	setColor(clr, false)
-- -- end

-- -- print('Box ID: ' .. node.chipid())

-- -- read_reg(dev_addr)

-- -- request.get(
-- -- 	'korte-broek-weer.herokuapp.com',
-- -- 	'/api',
-- -- 	handleResponse
-- -- )
