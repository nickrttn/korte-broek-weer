#include "config.h"
#include "libraries.h"

HTTPClient http;
WiFiManager wifiManager;
OpenWiFi hotspot;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

unsigned long lastTimeCheck = 0;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Serial.begin(115200);

  strip.begin();
  strip.setBrightness(255);

  hotspot.begin(BACKUP_SSID, BACKUP_PASSWORD);

  String chipID = generateChipID();
  Serial.println("Your ID is " + chipID);
}

void loop() {
  // Was our last request more than 5 minutes ago?
  if (lastTimeCheck == 0 || millis() - lastTimeCheck > 600000) {
    lastTimeCheck = millis();
    setColor(255, 0, 133);
    strip.show();
  }
}

String generateChipID() {
  String chipIDString = String(ESP.getChipId() & 0xffff, HEX);

  chipIDString.toUpperCase();
  while (chipIDString.length() < 4)
    chipIDString = String("0") + chipIDString;

  return chipIDString;
}

void setColor(int r, int g, int b) {
  for (int i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, r, g, b);
  }
}

