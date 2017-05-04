# NodeMCU code for Korte Broek Aan?

## Preparing for first use

**Pre-requirements**

- Python 2.7 or Python 3.4 or newer
- NodeJS v7+

1. Install [ESPtool](https://github.com/espressif/esptool). `pip install esptool`
2. Install [`nodemcu-tool`](https://www.npmjs.com/package/nodemcu-tool). `npm i -g nodemcu-tool`
3. Flash your NodeMCU with the provided firmware.
   `esptool.py --baud 460800 --port /dev/cu.SLAB_USBtoUART write_flash 0x00000 firmware/nodemcu-master-11-modules-2017-05-03-14-31-30-integer.bin`. Run this command from the current directory.
4. Upload the `.lua` files in this directory. `nodemcu-tool upload application.lua init.lua wifimodule.lua`
5. Update `wifimodule.lua` to connect to your SSID.
6. Connect to the NodeMCU serial monitor to see the output. `nodemcu-tool terminal`

You may need to reset the NodeMCU after `nodemcu-tool` commands to get it to work. Use the RST button.

## Sources

- https://learn.sparkfun.com/tutorials/sparkfun-usb-to-serial-uart-boards-hookup-guide
- https://stackoverflow.com/questions/22083676/how-to-create-an-array-of-variables-arduino#22083739
- http://selfbuilt.net/shop/full-color-rgb-led-matrix
- https://gist.github.com/texhex/3954113
