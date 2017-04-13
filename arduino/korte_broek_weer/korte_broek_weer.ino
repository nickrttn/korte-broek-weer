#include "config.h"
#include "libraries.h"

WiFiManager wifiManager;
OpenWiFi hotspot;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

String serverURL = SERVER_URL;
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
  HTTPClient http;

  // Was our last request more than 5 minutes ago?
  if (lastTimeCheck == 0 || millis() - lastTimeCheck > 600000) {
    String requestString = serverURL + "/api";
    http.begin(requestString);
    int httpCode = http.GET();
    
    if (httpCode == 200) {
      String response;
      response = http.getString();

      int i = response.indexOf(' ');
      int j = response.indexOf(' ', i + 1);
      int k = response.indexOf(' ', j + 1);

      int r = response.substring(0, i).toInt();
      int g = response.substring(i + 1, j).toInt();
      int b = response.substring(j + 1, k).toInt();
      
      setColor(r, g, b);
      strip.show();
    }

    lastTimeCheck = millis();
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

