// JavaScript Image Brightness ddn 2014 -

function Brightness(width, height, blendAlpha, algorithm, default_value, useWebWorker, callback){
		this.width = Math.abs(parseInt(width) || 0);
		this.height = Math.abs(parseInt(height) || 0);
		this.colorChannels = (!!blendAlpha) ? 4 : 3;
		this.algorithm = '';	// default
		this.default_value = (parseInt(default_value) || 0);
		this.useWebWorker = !!useWebWorker;
		this.callback = (typeof callback == "function") ? callback : function (returnedArray) {};
		this.initialize();
}
Brightness.prototype.initialize = function () {
	if (this.width > 0 && this.height > 0){
		if (this.useWebWorker) {
			this.configureWorker();
		}
		if (!this.useWebWorker) {
			this.configurePasses();
		}
	}
	else {
		throw(new Error("Invalid settings specified for the brightness."));
	}
}
Brightness.prototype.configureWorker = function () {
	// worker not inplement.
	this.useWebWorker = false;
}
Brightness.prototype.configurePasses = function () {
	// this version have only default.
	if ('' === this.algorithm) {	// default
		this.brightness_func = (this.colorChannels == 4) ? this.brightnessSimpleRGBA : this.brightnessSimpleRGB;
	}
	else{
		this.brightness_func = (this.colorChannels == 4) ? this.brightnessSimpleRGBA : this.brightnessSimpleRGB;
	}
}
Brightness.prototype.brightness = function (buffer, value){
	if (typeof value === "undefined"){
		value = this.default_value;
	}
	if (this.useWebWorker) {
		// FIXME:not implement.
	}
	else {
		output = this.brightness_func(buffer, value);
		this.callback(output);
	}
}


Brightness.prototype.brightnessSimpleRGBA = function (buffer, value) {
	var length = this.width * this.height * this.colorChannels;
	var output = this.generate_uint8_buffer(length);
	var pixel_base, r, g, b, dr, dg, db;
	for (var px = 0; px < (length);){

		pixel_base = px;
		r = buffer[px++];
		g = buffer[px++];
		b = buffer[px++];
		output[px] = buffer[px++];

		if (0 < value){
			dr = (255 - r) * value / 100;
			dg = (255 - g) * value / 100;
			db = (255 - b) * value / 100;
		}else{
			dr = (r * value / 100);
			dg = (g * value / 100);
			db = (b * value / 100);
		}


		output[pixel_base] = r + dr;
		output[pixel_base+1] = g + dg;
		output[pixel_base+2] = b +db;
	}
	return output;
}
Brightness.prototype.brightnessSimpleRGB = function (buffer, value) {
	var length = this.width * this.height * this.colorChannels;
	var output = this.generate_uint8_buffer(length);
	var pixel_base, r, g, b, dr, dg, db;
	for (var px = 0; px < (length);){
		pixel_base = px;
		r = buffer[px++];
		g = buffer[px++];
		b = buffer[px++];

		if (0 < value){
			dr = (255 - r) * value / 100;
			dg = (255 - g) * value / 100;
			db = (255 - b) * value / 100;
		}else{
			dr = (r * value / 100);
			dg = (g * value / 100);
			db = (b * value / 100);
		}

		output[pixel_base] = r + dr;
		output[pixel_base+1] = g + dg;
		output[pixel_base+2] = b +db;
	}
	return output;
}
Brightness.prototype.generate_uint8_buffer = function (bufferLength) {
	//Generate a uint8 typed array buffer:
	try {
		return new Uint8Array(bufferLength);
	}
	catch (error) {
		return [];
	}
}

