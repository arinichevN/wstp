function RuntimeChannelRow(slave, util){
	this.slave = slave;
	this.util = util;
	this.container = cd();
	this.id = cd();
	this.method = cd();
	this.channel_state = cd();
    this.uptime = cd();
    this.result = cd();
    this.output = cd();
    this.step = new RuntimeStepRow(this.slave, this.util);
	this.logger = new RuntimeLoggerRow(this.slave.logger);
    this.startB = cb("");
    this.stopB = cb("");
    this.prB = cb("");//pause, resume button
    this.pause = true;
	this.updateStr = function(){
		this.id.title = trans.get(321);
		this.method.title = trans.get(329);
		this.channel_state.title = trans.get(361);
		this.uptime.title = trans.get(347);
		this.result.title = trans.get(359);
		this.output.title = trans.get(360);
		this.step.updateStr();
		this.startB.innerHTML = trans.get(352);
		this.stopB.innerHTML = trans.get(353);
		this.logger.updateStr();
		this.prBUpdateStr();
	};
	this.prBUpdateStr = function(){
		let str;
		if(this.pause){
			str = trans.get(354);
		}else{
			str = trans.get(355);
		}
		this.prB.innerHTML = str;
	};
	this.pauseResume = function(){
		if(this.pause){
			if(this.slave.pause()){
				this.pause = false;
				this.prB.disabled = true;
				this.util.blinkS(this.prB);
			}else{
				this.util.blinkF(this.prB);
			}
		}else{
			if(this.slave.resume()){
				this.pause = true;
				this.prB.disabled = true;
				this.util.blinkS(this.prB);
			}else{
				this.util.blinkF(this.prB);
			}
		}
		this.prBUpdateStr();
	};
	this.prBStateChanged = function(state){
		switch(state){
			case RUN:
				this.pause = true;
				this.prB.disabled = false;
				this.prBUpdateStr();
				break;
			case PAUSE:
				this.pause = false;
				this.prB.disabled = false;
				this.prBUpdateStr();
				break;
			case PAUSING:
				this.pause = true;
				this.prB.disabled = true;
				this.prBUpdateStr();
				break;
			case RESUMING:
				this.pause = false;
				this.prB.disabled = true;
				this.prBUpdateStr();
				break;
			default:
				this.pause = true;
				this.prB.disabled = true;
				this.prBUpdateStr();
				break;
		}
	};
	this.getMethodStr = function(){
		switch(this.slave.reg.method){
			case REG_METHOD_PID:	return "PID " + this.util.toStr(this.getModeStr(this.slave.reg.pid.mode));
			case REG_METHOD_POS2:	return "POS2 " + this.util.toStr(this.getModeStr(this.slave.reg.pos2.mode));
			case REG_METHOD_POS1:	return "POS1";
		}
		return this.util.UNKNOWN_STR;
	};
	this.getModeStr = function(v){
		switch(v){
			case REG_MODE_HEATER:	return "HEATER";
			case REG_MODE_COOLER:	return "COOLER";
		}
		return null;
	};
	this.showChannelState = function(){
		this.util.updateStateStrElem(this.channel_state, this.slave.state);
		this.prBStateChanged(this.slave.state);
	};
	this.showResult = function(v){
		this.util.updateFloatElem(this.result, v.value);
	};
	this.showOutput = function (v, state){
		this.util.updateElem2(this.output, v, state);
	};
	this.showChannelIni = function(){
		this.util.updateElem(this.id, this.slave.id);
		this.method.innerHTML = this.getMethodStr();
	};
	this.showChannelRun = function(){
		this.showChannelState();
		this.showChannelUptime();
		this.util.elemSetBadVal(this.result);
		this.util.updateElem2(this.output, null, SUCCESS);
	};
	this.showChannelUptime = function(){
		this.util.updateTimeElem(this.uptime, this.slave.getUptime());
	};
	this.showStepIni = function(){
		this.step.showIni();
	};
	this.showStepRun = function(){
		this.step.showRun();
	};
	this.showAll = function(){
		this.showChannelIni();
		this.showChannelRun();
	};
	this.startB.onclick = () => {
		this.slave.start();
	};
	this.stopB.onclick = () => {
		this.slave.stop();
	};
	this.prB.onclick = () => {
		this.pauseResume();
	};
	let pcont = cd();
	let picont = cd();
	let prcont = cd();
	let pfcont = cd();
	let pbcont = cd();
	
	a(picont, [this.id, this.method]);
	a(prcont, [this.channel_state, this.uptime, this.result, this.output]);
	a(pfcont, [picont, prcont]);
	a(pbcont, [this.startB, this.stopB, this.prB]);
	a(pcont, [pbcont, pfcont]);
	a(this.container, [pcont, this.step, this.logger]);
	cla([pfcont,  pbcont],["fl"]);
	cla([pcont, picont, prcont, pfcont],["flcl"]);
	cla([this.id, this.method],["rcr_ini"]);
	cla([this.result, this.channel_state, this.uptime, this.output],["rcr_run"]);
	cla([this.id, this.method, this.result, this.channel_state, this.uptime, this.output],["fl", "rcr_str"]);
	cla([this.result],["rcr_important"]);
	cla(this.container, ["flcr", "rcr_cont"]);
}
