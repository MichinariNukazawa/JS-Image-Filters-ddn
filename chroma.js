// JavaScript Image Chroma ddn 2014 -
// depend: hsv.js

function Chroma(width, height, blendAlpha, algorithm, default_value, useWebWorker, callback){
		this.width = Math.abs(parseInt(width) || 0);
		this.height = Math.abs(parseInt(height) || 0);
		this.colorChannels = (!!blendAlpha) ? 4 : 3;
		this.algorithm = algorithm;
		this.default_value = (parseInt(default_value) || 0);
		this.useWebWorker = !!useWebWorker;
		this.callback = (typeof callback == "function") ? callback : function (returnedArray) {};
		this.initialize();
}
Chroma.prototype.initialize = function () {
	if (this.width > 0 && this.height > 0){
		if (this.useWebWorker) {
			this.configureWorker();
		}
		if (!this.useWebWorker) {
			this.configurePasses();
		}
	}
	else {
		throw(new Error("Invalid settings specified for the chroma."));
	}
}
Chroma.prototype.configureWorker = function () {
	// worker not inplement.
	this.useWebWorker = false;
}
Chroma.prototype.configurePasses = function () {
	// this version have only default.
	if ('' === this.algorithm) {	// default
		this.chroma_func = (this.colorChannels == 4) ? this.chromaSimpleRGBA : this.chromaSimpleRGB;
	}
	else{
		this.chroma_func = (this.colorChannels == 4) ? this.chromaSimpleRGBA : this.chromaSimpleRGB;
	}
}
Chroma.prototype.chroma = function (buffer, value){
	if (typeof value === "undefined"){
		value = this.default_value;
	}
	if (this.useWebWorker) {
		// FIXME:not implement.
	}
	else {
		output = this.chroma_func(buffer, value);
		this.callback(output);
	}
}


Chroma.prototype.chromaSimpleRGBA = function (buffer, value) {
	var length = this.width * this.height * this.colorChannels;
	var output = this.generate_uint8_buffer(length);
	var pixel_base, r, g, b, dr, dg, db;
	var hsv, rgb, dh;
	for (var px = 0; px < (length);){

		pixel_base = px;
		r = buffer[px++];
		g = buffer[px++];
		b = buffer[px++];
		output[px] = buffer[px++];

		hsv = HSVfromRGB(r, g, b);

		
			if (0 < value){
				dh = (1 - hsv[1]) * value / 100;
				// canceling near white. (because vivid primary color)
				dh *= hsv[1];
			}else{
				dh = (hsv[1] * value / 100);
			}
			hsv[1] += dh;

		rgb = RGBfromHSV( hsv[0], hsv[1], hsv[2] );

		output[pixel_base] = rgb[0]
		output[pixel_base+1] = rgb[1];
		output[pixel_base+2] = rgb[2];
	}
	return output;
}
Chroma.prototype.chromaSimpleRGB = function (buffer, value) {
	var length = this.width * this.height * this.colorChannels;
	var output = this.generate_uint8_buffer(length);
	var pixel_base, r, g, b, dr, dg, db;
	var hsv, rgb, dh;
	for (var px = 0; px < (length);){

		pixel_base = px;
		r = buffer[px++];
		g = buffer[px++];
		b = buffer[px++];

		hsv = HSVfromRGB(r, g, b);

		// canceling near white. (because vivid primary color)
		if ( hsv[2] < 0.98 ){
			if (0 < value){
				dh = (1 - hsv[1]) * value / 100;
			}else{
				dh = (hsv[1] * value / 100);
			}
			hsv[1] += dh;
		}

		rgb = RGBfromHSV( hsv[0], hsv[1], hsv[2] );

		output[pixel_base] = rgb[0]
		output[pixel_base+1] = rgb[1];
		output[pixel_base+2] = rgb[2];
	}
	return output;
}
Chroma.prototype.generate_uint8_buffer = function (bufferLength) {
	// Generate a uint8 typed array buffer:
	try {
		return new Uint8Array(bufferLength);
	}
	catch (error) {
		return [];
	}
}

