
const REG_MODE_HEATER = 1;
const REG_MODE_COOLER = 0;

const REG_METHOD_PID = 0;
const REG_METHOD_POS2 = 1;
const REG_METHOD_POS1 = 2;

const OUT_MAX = 0;
const OUT_MIN = 1;

let ind = 0;
const INIT = ind; ind++;
const OFF = ind; ind++;
const EOFF = ind; ind++;
const DONE = ind; ind++;
const RUN = ind; ind++;
const HOLD = ind; ind++;
const REACH = ind; ind++;
const FAILURE = ind; ind++;
const SUCCESS = ind; ind++;
const PAUSE = ind; ind++;
const PAUSING = ind; ind++;
const RESUMING = ind; ind++;
const STOPPING = ind; ind++;
const START_REMOTE = ind; ind++;
const STOP_REMOTE = ind; ind++;

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
const regmode_list = [
	{name: "HEATER", value:REG_MODE_HEATER},
	{name: "COOLER", value:REG_MODE_COOLER}
];
const regmethod_list = [
	{name: "PID", value:REG_METHOD_PID},
	{name: "Pos2", value:REG_METHOD_POS2},
	{name: "Pos1", value:REG_METHOD_POS1}
];
const yn_list = [
	{name: "YES", value:1},
	{name: "NO", value:0}
];

function equalEMs(em1, em2){
	if(
		em1.id === em2.id && 
		em1.peer.ip_addr === em2.peer.ip_addr && 
		em1.peer.port === em2.peer.port
	){
		return true;
	}
	return false;
}

function equalSensors(s1, s2){
	if(
		s1.id === s2.id && 
		s1.peer.ip_addr === s2.peer.ip_addr && 
		s1.peer.port === s2.peer.port
		){
		return true;
	}
	return false;
}
