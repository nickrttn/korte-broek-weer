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

uint8_t percentage[8][8];

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

  Serial.print("event_received: ");
  Serial.println(type);

	switch(type) {
		case 'c': handle_color_evt(); break;
		case 's': handle_state_evt(); break;
		case 't': handle_temp_evt(); break;
		case 'd': handle_display_evt(); break;
		case 'p': handle_pct_evt(); break;
	}

  event_received = true;
}

void handle_color_evt() {
	uint8_t i = 0;
	ColorRGB c[3] = {};

	while (0 < Wire.available()) {
		unsigned char v = Wire.read();
		switch (i) {
			case 0: user_color.r = v; break;
			case 1: user_color.g = v; break;
			case 2: user_color.b = v; break;
		}
		i++;
	}
}

void handle_state_evt() {
	uint8_t i = Wire.read();
	state = i;
	tmp_state = state;
}

void handle_temp_evt() {
	uint8_t i = Wire.read();
	tmp_state = i;
}

void handle_display_evt() {
	switch_state();
}

void handle_pct_evt() {
	uint8_t pct = Wire.read();
	tmp_state = 4;
	draw_percentage(pct);
}

void switch_state() {
	tmp_state = state;
}

void draw(uint8_t drawing) {
	switch(drawing) {
		case 0: draw_shape(lange_broek); break;
		case 1: draw_shape(korte_broek); break;
		case 2: draw_shape(success); break;
		case 3: draw_shape(failure); break;
		case 4: draw_shape(percentage); break;
		default: draw_shape(failure); break;
	}
}

void draw_shape(uint8_t arr[][8]) {
  for (uint8_t i = 0; i < screen_size; i++) {
  	for (uint8_t j = 0; j < screen_size; j++) {
  		if (arr[i][j]) {
	    	Colorduino.SetPixel(i, j, user_color.r, user_color.g, user_color.b);
	    	Serial.print(arr[i][j]);
	    	Serial.print(" ");
  		} else {
  			Colorduino.SetPixel(i, j, 0, 0, 0);
  			Serial.print(arr[i][j]);
	    	Serial.print(" ");
  		}
  	}
  	Serial.println("");
  }

  Colorduino.FlipPage();
}

/**
 * [draw_percentage Constructs a 8*8 matrix ]
 * @param  percentage [description]
 * @return            [description]
 */
void draw_percentage(uint8_t pct) {
	float num_leds = ((float)pct / 100.00) * 64.00;
	uint8_t rounded_leds = round(num_leds);
	uint8_t cur_led = 1;

	for (uint8_t i = 0; i < screen_size; i++) {
		for (uint8_t j = 0; j < screen_size; j++) {
			if (cur_led <= rounded_leds) {
	    	percentage[i][j] = 1;
			} else {
  			percentage[i][j] = 0;
			}

			cur_led++;
		}
	}
}
