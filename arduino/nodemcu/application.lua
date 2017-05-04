local request = require 'request'
local util = require 'util'

local api_endpoint = "korte-broek-api.herokuapp.com"
local user_state = 0
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

-- timed request setup
local timer = tmr.create()

-- get the users' color
request.get(
	api_endpoint,
	'/user/' .. node.chipid(),
	function(res)
		local user = util.parse_json(res)
		local clr = user["color"]
		util.send_event('c', clr["r"], clr["g"], clr["b"])
	end
)

-- get the current temperature
function get_temp()
	request.get(
	api_endpoint,
	'/temperature',
	function(res)
		local t = util.parse_json(res)
		local s;
		if tonumber(t["temp"]) >= 22 then s=1 else s=0 end
		util.send_event('s', s)
	end)
end

get_temp()

timer:register(600000, tmr.ALARM_AUTO, get_temp)
timer:start()

-- muxer setup (connected to pin A0)
local channel = 0
local mux_state = 'pot'
local prev_pot_value = 0
local prev_tilt_value = 0

-- poll the muxer every 100ms
timer:register(50, tmr.ALARM_AUTO, function()
	if mux_state == 'pot' then
		util.calibrate_muxer(gpio.LOW, gpio.LOW, gpio.LOW)
		local val = adc.read(channel)

		if math.abs(val - prev_pot_value) > 50 then
			local state
			prev_pot_value = val
			if val > 512 then state = 1 else state = 0 end
			-- after 3 seconds, POST a status to /user/:id/status
			-- 0 = lange_broek (false)
			-- 1 = korte_broek (true)
			util.send_event('t', state)

			if not (state == user_state) then
				user_state = state
				util.debounce(3000000, function()
					local t = {}
					t["status"] = user_state
					local json = util.encode_json(t)
					request.post(
						api_endpoint,
						'/user/' .. node.chipid() .. '/status',
						json,
						function(res)
							print(res)
							local t = util.parse_json(res)
							local evt
							if t["status"] == "success" then evt = 2 else evt = 3 end
							util.send_event('t', evt)
						end
	 				)
				end)
			end
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
timer:start()

-- listen to button presses
gpio.trig(button, "down", function()
	-- debounce button presses by 250ms
  util.debounce(250000, function()
  	util.send_event('d')
  end)
end)
