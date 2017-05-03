local request = require 'request'

-- GPIO pins
local button = 4
local muxer_0 = 1
local muxer_1 = 2
local muxer_2 = 3

-- GPIO setup
gpio.mode(button, gpio.INT)
gpio.mode(muxer_0, gpio.OUTPUT)
gpio.mode(muxer_1, gpio.OUTPUT)
gpio.mode(muxer_2, gpio.OUTPUT)

-- I2C setup
local i2c_id = 0  -- I2C bus id
local sda = 5 -- NodeMCU D1 pin
local scl = 6 -- NodeMCU D2 pin
local dev_addr = 0x01

i2c.setup(i2c_id, sda, scl, i2c.SLOW)

-- Muxer setup (connected to pin A0)
local channel = 0

local mux_timer = tmr.create()
local muxer_state = 'pot'

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

-- Poll the muxer every 100ms
mux_timer:register(50, tmr.ALARM_AUTO, function()
	if muxer_state == 'pot' then
		calibrate_muxer(gpio.LOW, gpio.LOW, gpio.LOW)

		-- read the pot value
		local pot_value = adc.read(channel)

		-- if the pot value has changed more than ~50
		if math.abs(pot_value - prev_pot_value) > 50 then
			local state
			prev_pot_value = pot_value
			if pot_value >= 512 then state = 1 else state = 0 end
			send_state(state)
		end

		muxer_state = 'tilt'
	end

	if muxer_state == 'tilt' then
		calibrate_muxer(gpio.LOW, gpio.HIGH, gpio.LOW)

		-- read the pot value
		local tilt_value = adc.read(channel)

		-- if the pot value has changed more than ~50
		if math.abs(tilt_value - prev_tilt_value) > 512 then
			-- local state
			prev_tilt_value = tilt_value
			print('shake that thing')
		end

		muxer_state = 'pot'
	end
end)
mux_timer:start()

function calibrate_muxer(a, b, c)
	gpio.write(muxer_0, a)
	gpio.write(muxer_1, b)
	gpio.write(muxer_2, c)
end

function send_event(evt)
	i2c.start(i2c_id)
	i2c.address(i2c_id, dev_addr, i2c.TRANSMITTER)
	i2c.write(i2c_id, evt)
	i2c.stop(i2c_id)
end

function send_color(r, g, b)
	i2c.start(i2c_id)
	i2c.address(i2c_id, dev_addr, i2c.TRANSMITTER)
	i2c.write(i2c_id, 'c', r, g, b)
	i2c.stop(i2c_id)
end

send_color(255, 0, 0)

function send_state(state)
	i2c.start(i2c_id)
	i2c.address(i2c_id, dev_addr, i2c.TRANSMITTER)
	i2c.write(i2c_id, 's', state)
	i2c.stop(i2c_id)
end

send_state(0)

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
