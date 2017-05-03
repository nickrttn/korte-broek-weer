#include <Wire.h>
#include <Colorduino.h>

unsigned char white_balance[3] = { 31, 63, 18 };

struct ColorRGB {
  unsigned char r;
  unsigned char g;
  unsigned char b;
};

ColorRGB user_color = { 0, 220, 0 };

unsigned long previousMillis;
int timeout = 10 * 1000; // 20 seconds

uint8_t screen_size = 8;
uint8_t state;
uint8_t tmp_state;

bool event_received;
bool timer_running;
bool displaying;

uint8_t lange_broek[8][8] = {
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 1, 1, 1, 1, 1, 0, 0 },
	{ 0, 1, 1, 1, 1, 1, 0, 0 },
	{ 0, 1, 1, 0, 1, 1, 0, 0 },
	{ 0, 1, 1, 0, 1, 1, 0, 0 },
	{ 0, 1, 1, 0, 1, 1, 0, 0 },
	{ 0, 1, 1, 0, 1, 1, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 }
};

uint8_t korte_broek[8][8] = {
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 1, 1, 1, 1, 1, 0, 0 },
	{ 0, 1, 1, 1, 1, 1, 0, 0 },
	{ 0, 1, 1, 0, 1, 1, 0, 0 },
	{ 0, 1, 1, 0, 1, 1, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 }
};

uint8_t success[8][8] = {
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 1 },
	{ 0, 0, 0, 0, 0, 0, 1, 1 },
	{ 0, 0, 0, 0, 0, 1, 1, 0 },
	{ 1, 0, 0, 0, 1, 1, 0, 0 },
	{ 1, 1, 0, 1, 1, 0, 0, 0 },
	{ 0, 1, 1, 1, 0, 0, 0, 0 },
	{ 0, 0, 1, 0, 0, 0, 0, 0 }
};

uint8_t failure[8][8] = {
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 1, 0, 0, 0, 0, 1, 0 },
	{ 0, 0, 1, 0, 0, 1, 0, 0 },
	{ 0, 0, 0, 1, 1, 0, 0, 0 },
	{ 0, 0, 0, 1, 1, 0, 0, 0 },
	{ 0, 0, 1, 0, 0, 1, 0, 0 },
	{ 0, 1, 0, 0, 0, 0, 1, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 }
};

uint8_t blank[8][8] = {
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 },
	{ 0, 0, 0, 0, 0, 0, 0, 0 }
};

void setup() {
	Serial.begin(9600);

	// Initialize the Colorduino library
  Colorduino.Init();
  Colorduino.SetWhiteBal(white_balance);

	// Register on the I2C bus w/ device id 1
  Wire.begin(1);

  // Call handle_event when a message comes in
  Wire.onReceive(handle_event);

  timer_running = true;
  tmp_state = 2;
	draw(tmp_state);
}

void loop() {
  unsigned long currentMillis = millis();

  // If we received an event, we should probably do stuff
  if (event_received) {
  	previousMillis = currentMillis;
  	event_received = false;
  	timer_running = true;
	  draw(tmp_state);
  }

  if (timer_running) {
  	if (timeout < currentMillis - previousMillis) {
  		timer_running = false;
  		previousMillis = 0;
  		draw_shape(blank);
	  }
  }
}

void handle_event(uint8_t len) {
	char type = Wire.read();

	// Color event
	if (type == 'c') {
		uint8_t i = 0;
		ColorRGB c[3] = {};
		while (0 < Wire.available()) {
			unsigned char v = Wire.read();
			if (i == 0) {
				user_color.r = v;
			}

			if (i == 1) {
				user_color.g = v;
			}

			if (i == 2) {
				user_color.b = v;
			}

			i++;
		}
	}

	// State event
	if (type == 's') {
		uint8_t i = Wire.read();
		state = i;
		tmp_state = state;
	}

	// Temporary event
	if (type == 't') {
		uint8_t i = Wire.read();
		tmp_state = i;
	}

	// Display event
	if (type == 'd') {
		tmp_state = state;
	}

  event_received = true;
}

void draw(uint8_t state) {
	switch(state) {
		case 0: draw_shape(lange_broek); break;
		case 1: draw_shape(korte_broek); break;
		case 2: draw_shape(success); break;
		case 3: draw_shape(failure); break;
		default: draw_shape(failure); break;
	}
}

void draw_shape(uint8_t arr[][8]) {
  for (uint8_t i = 0; i < screen_size; i++) {
  	for (uint8_t j = 0; j < screen_size; j++) {
  		if (arr[i][j]) {
	    	Colorduino.SetPixel(i, j, user_color.r, user_color.g, user_color.b);
  		} else {
  			Colorduino.SetPixel(i, j, 0, 0, 0);
  		}
  	}
  }

  Colorduino.FlipPage();
}
