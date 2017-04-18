# NodeMCU code for Korte Broek Aan?

## Preparing for first use

**Pre-requirements**

- Python 2.7 or Python 3.4 or newer
- NodeJS v7+

1. Install [ESPtool](https://github.com/espressif/esptool). `pip install esptool`
2. Install [`nodemcu-tool`](https://www.npmjs.com/package/nodemcu-tool). `npm i -g nodemcu-tool`
3. Flash your NodeMCU with the provided firmware. `esptool.py --port /dev/cu.SLAB_USBtoUART write_flash -fm qio 0x00000 firmware/nodemcu-1.5.4.1-integer.bin`. Run this command from the current directory.
4. Upload the `.lua` files in this directory. `nodemcu-tool upload application.lua init.lua wifimodule.lua`
5. Connect to the NodeMCU serial monitor to see the output. `nodemcu-tool terminal`

You may need to reset the NodeMCU after `nodemcu-tool` commands to get it to work. Use the RST button.
