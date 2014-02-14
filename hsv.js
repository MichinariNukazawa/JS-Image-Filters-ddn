/* JavaScript Image HSV/RGB converter ddn 2014 - Michinari Nukazawa
 * 	Convert RGB <=> HSV
 */

/* @breaf HSVfromRGB
 * 		r, g, b: 0 ~ 255
 * 		return hsv[0-2] h:0~360 s,v: 0.0 ~ 1.0
 */
function HSVfromRGB(r, g, b){
	var hsv = new Array();
	var h, s, v;
	var max, min;

	r /= 255;
	g /= 255;
	b /= 255;

	if ( r > g){
		max = r;
		min = g;
	}else{
		max = g;
		min = r;
	}
	max = (( max > b ) ? max:b);
	min = (( min < b ) ? min:b);
	sub = max - min;

	if ( sub == 0 ){
		h = 0;
	}else{
		if ( max == r){
			h = (60 * (g - b) / sub) + 0;
		}else if (max == g){
			h = (60 * (b - r) / sub) + 120;
		}else{ // if (max == b){
			h = (60 * (r - g) / sub) + 240;
		}
		if (h < 0){
			h += 360;
		}
	}

	if (max > 0){
		s = sub / max;
	}

	v = max;

	hsv[0] = h % 360;
	hsv[1] = s;
	hsv[2] = v;

	return hsv;
}

/* @breaf RGBfromHSV
 * 		h: 0~360 s,v: 0.0~1.0
 * 		return rgb[0-2]: 0 ~ 255
 */
function RGBfromHSV(h, s, v){
	var r = 0, g = 0, b = 0;
	var rgb = new Array();
	if ( 0 == s){
		v *= 255;
		rgb[0] = v;
		rgb[1] = v;
		rgb[2] = v;
		return rgb;
	}

	var hi = Math.floor(h / 60);
	var f = (h / 60) - hi;
	var p, q, t;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);

	switch (hi){
		case 0:
		 r = v; g = t; b = p;
		 break;
		case 1:
		 r = q; g = v; b = p;
		 break;
		case 2:
		 r = p; g = v; b = t;
		 break;
		case 3:
		 r = p; g = q; b = v;
		 break;
		case 4:
		 r = t; g = p; b = v;
		 break;
		case 5:
		 r = v; g = p; b = q;
		 break;
		default:
		 console.log("error def");
		 break;
	}

	rgb[0] = r * 255;
	rgb[1] = g * 255;
	rgb[2] = b * 255;

	return rgb;
}
