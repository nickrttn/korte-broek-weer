# NodeMCU code for Korte Broek Aan?

## Preparing for first use

**Pre-requirements**

- Python 2.7 or Python 3.4 or newer
- NodeJS v7+

1. Install [ESPtool](https://github.com/espressif/esptool). `pip install esptool`
2. Install [`nodemcu-tool`](https://www.npmjs.com/package/nodemcu-tool). `npm i -g nodemcu-tool`
3. Flash your NodeMCU with the provided firmware.
   `esptool.py --baud 460800 --port /dev/cu.SLAB_USBtoUART write_flash 0x00000 firmware/nodemcu-master-11-modules-2017-05-03-14-31-30-integer.bin`. Run this command from the current directory.
4. Upload the `.lua` files in this directory. `nodemcu-tool upload *.lua`
5. Update `wifimodule.lua` to connect to your SSID.
6. Connect to the NodeMCU serial monitor to see the output. `nodemcu-tool terminal`
7. Upload the colorduino.ino file to a Colorduino using the Arduino IDE.

You may need to reset the NodeMCU after `nodemcu-tool` commands to get it to work. Use the RST button.

## Programming

The NodeMCU `GET`s and `POST`s user colors, temperature and status to a JSON API. Based on that, it sends different types of events to the Colorduino over I2C in a master/slave configuration. The Colorduino displays something on its' LED matrix based on the event type and data it received.

The NodeMCU is programmed in Lua, which enables event-based programming, as opposed to the continuously looped programming style of the Arduino. The Colorduino uses a regular Arduino `.ino` file, programming in C/C++. Both programs have been optimized to have a small memory footprint (within my current knowledge). This was my very first project programmed in Lua, and only the second time I programmed an Arduino using the Arduino C/C++ language subset.

## Hardware

- Colorduino v1.3
- 2088RGB 8&times;8 LED matrix
- NodeMCU w/ the NodeMCU Lua firmware on the `master` branch.
- a 4051 multiplexer
- tilt sensor
- potentiometer
- big red button

The setup uses two different analog sensors. The NodeMCU however, has only one analog port, so I used a multiplexer to be able to listen to each chip. The chip read out is alternated every 50ms and LED matrix state is updated accordingly.

Each of the sensors triggers a different type of user request to the JSON API and a different display on the LED matrix.

## Sources

- https://learn.sparkfun.com/tutorials/sparkfun-usb-to-serial-uart-boards-hookup-guide
- https://stackoverflow.com/questions/22083676/how-to-create-an-array-of-variables-arduino#22083739
- http://selfbuilt.net/shop/full-color-rgb-led-matrix
- https://gist.github.com/texhex/3954113
