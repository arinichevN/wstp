
var REG_MODE_HEATER = 1;
var REG_MODE_COOLER = 0;

var REG_METHOD_PID = 0;
var REG_METHOD_POS2 = 1;
var REG_METHOD_POS1 = 2;

var OUT_MAX = 0;
var OUT_MIN = 1;

var ind = 0;
var INIT = ind; ind++;
var OFF = ind; ind++;
var EOFF = ind; ind++;
var DONE = ind; ind++;
var RUN = ind; ind++;
var HOLD = ind; ind++;
var REACH = ind; ind++;
var FAILURE = ind; ind++;
var SUCCESS = ind; ind++;
var PAUSE = ind; ind++;
var PAUSING = ind; ind++;
var RESUMING = ind; ind++;
var STOPPING = ind; ind++;
var START_REMOTE = ind; ind++;
var STOP_REMOTE = ind; ind++;

function getStateStr(v){
	switch(v){
		case INIT:			return "INIT";
		case OFF:			return "OFF";
		case EOFF:			return "EOFF";
		case DONE:			return "DONE";
		case RUN:			return "RUN";
		case HOLD:			return "HOLD";
		case REACH:			return "REACH";
		case FAILURE:		return "FAILURE";
		case SUCCESS:		return "SUCCESS";
		case PAUSE:			return "PAUSE";
		case PAUSING:		return "PAUSING";
		case RESUMING:		return "RESUMING";
		case STOPPING:		return "STOPPING";
		case START_REMOTE:	return "START_REMOTE";
		case STOP_REMOTE:	return "STOP_REMOTE";
	}
	return "?";
}
var regmode_list = [
	{name: "HEATER", value:REG_MODE_HEATER},
	{name: "COOLER", value:REG_MODE_COOLER}
];
var regmethod_list = [
	{name: "PID", value:REG_METHOD_PID},
	{name: "Pos2", value:REG_METHOD_POS2},
	{name: "Pos1", value:REG_METHOD_POS1}
];
var yn_list = [
	{name: "YES", value:1},
	{name: "NO", value:0}
];

