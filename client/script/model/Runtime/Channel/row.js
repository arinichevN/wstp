function RuntimeChannelRow(slave){
	this.slave = slave;
	this.container = cd();
	this.id = cd();
	this.method = cd();
	this.channel_state = cd();
    this.uptime = cd();
    this.result = cd();
    this.output = cd();
    this.step = {
		id:null,
		goal:null,
		cgoal:null,
		reach_time:null,
		hold_time:null,
		rcountd:null,
		hcountd:null,
		prevB:null,
		nextB:null
	};
	this.step.id = cd();
	this.step.goal = cd();
	this.step.cgoal = cd();
	this.step.reach_time = cd();
	this.step.hold_time = cd();
	this.step.rcountd = cd();
	this.step.hcountd = cd();
	this.step.prevB = cb("&leftarrow;");
	this.step.nextB = cb("&rightarrow;");
    this.startB = cb("");
    this.stopB = cb("");
    this.prB = cb("");//pause, resume button
    this.UNKNOWN_STR = "&empty;";
    this.blink_tm = 270;
    this.precision = 2;
    this.pause = true;
	this.updateStr = function(){
		this.id.title = trans.get(321);
		this.method.title = trans.get(329);
		this.channel_state.title = trans.get(361);
		this.uptime.title = trans.get(347);
		this.result.title = trans.get(359);
		this.output.title = trans.get(360);
		this.step.id.title = trans.get(321);
		this.step.goal.title = trans.get(337);
		this.step.cgoal.title = trans.get(357);
		this.step.reach_time.title = trans.get(348);
		this.step.hold_time.title = trans.get(349);
		this.step.rcountd.title = trans.get(350);
		this.step.hcountd.title = trans.get(351);
		this.startB.innerHTML = trans.get(352);
		this.stopB.innerHTML = trans.get(353);
		this.step.prevB.title = trans.get(362);
		this.step.nextB.title = trans.get(356);
		this.prBUpdateStr();
	};
	this.prBUpdateStr = function(){
		var str;
		if(this.pause){
			str = trans.get(354);
		}else{
			str = trans.get(355);
		}
		this.prB.innerHTML = str;
	};
	this.blinkS = function(elem){
		blink(elem, "pr_success", this.blink_tm);
	};
	this.blinkF = function(elem){
		blink(elem, "pr_failed", this.blink_tm);
	};
	this.pauseResume = function(){
		if(this.pause){
			if(this.slave.pause()){
				this.pause = false;
				this.prB.disabled = true;
				this.blinkS(this.prB);
			}else{
				this.blinkF(this.prB);
			}
		}else{
			if(this.slave.resume()){
				this.pause = true;
				this.prB.disabled = true;
				this.blinkS(this.prB);
			}else{
				this.blinkF(this.prB);
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
	this.toStr = function(v){
		if(v===null){
			return this.UNKNOWN_STR;
		}
		return v;
	};
	this.getMethodStr = function(){
		switch(this.slave.reg.method){
			case REG_METHOD_PID:	return "PID " + this.toStr(this.getModeStr(this.slave.reg.pid.mode));
			case REG_METHOD_POS2:	return "POS2 " + this.toStr(this.getModeStr(this.slave.reg.pos2.mode));
			case REG_METHOD_POS1:	return "POS1";
		}
		return this.UNKNOWN_STR;
	};
	this.getModeStr = function(v){
		switch(v){
			case REG_MODE_HEATER:	return "HEATER";
			case REG_MODE_COOLER:	return "COOLER";
		}
		return null;
	};
	this.elemSetBadVal = function(elem){
		elem.innerHTML = this.UNKNOWN_STR;
		cla(elem, "rcr_badval");
	};
	this.elemSetGoodVal = function(elem, v){
		elem.innerHTML = v;
		clr(elem, "rcr_badval");
	};
	this.updateElem = function(elem, v){
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			this.elemSetGoodVal(elem, v);
		}
	};
	this.updateElemBl = function(elem, v){
		if(v !== null){
			this.elemSetGoodVal(elem, v);
			this.blinkS(elem);
		}else{
			this.elemSetBadVal(elem);
			this.blinkF(elem);
		}
	};
	this.updateElem2 = function(elem, v, state){
		if(v !== null){
			elem.innerHTML = v.toFixed(this.precision);
		}else{
			elem.innerHTML = this.UNKNOWN_STR;
		}
		if(state === SUCCESS){
			clr(elem, "prp_failed");
			if(v===null){
				cla(elem, "rcr_badval");
			}else{
				clr(elem, "rcr_badval");
			}
		}else{
			clr(elem, "rcr_badval");
			cla(elem, "prp_failed");
		}
	};
	
	this.updateTimeElem = function(elem, v){
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			var v1 = v/1000;//seconds
			this.elemSetGoodVal(elem, intToTimeStr(parseInt(v1.toFixed(0))));
		}
	};
	this.updateStateStrElem = function(elem, v){;
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			this.elemSetGoodVal(elem, getStateStr(v));
		}
	};
	this.updateFloatElem = function(elem, v){
		if(v===null){
			this.elemSetBadVal(elem);
		}else{
			this.elemSetGoodVal(elem, v.toFixed(this.precision));
		}
	};
	this.updateFloatElemBl = function(elem, v){
		if(v !== null){
			this.elemSetGoodVal(elem, v.toFixed(this.precision));
			this.blinkS(elem);
		}else{
			this.elemSetBadVal(elem);
			this.blinkF(elem);
		}
	};
	this.showChannelState = function(){
		this.updateStateStrElem(this.channel_state, this.slave.state);
		this.prBStateChanged(this.slave.state);
	};
	this.showResult = function(v){
		this.updateFloatElem(this.result, v.value);
	};
	this.showOutput = function (v, state){
		this.updateElem2(this.output, v, state);
	};
	this.showChannelIni = function(){
		this.updateElem(this.id, this.slave.id);
		this.method.innerHTML = this.getMethodStr();
	};
	this.showChannelRun = function(){
		this.showChannelState();
		this.showChannelUptime();
		this.elemSetBadVal(this.result);
		this.updateElem2(this.output, null, SUCCESS);
	};
	this.showChannelUptime = function(){
		this.updateTimeElem(this.uptime, this.slave.getUptime());
	};
	this.showStepIni = function(){
		var step = this.slave.step;
		this.updateElem(this.step.id, step.id);
		this.updateFloatElem(this.step.goal, step.goal);
		this.updateTimeElem(this.step.reach_time, step.reach_time);
		this.updateTimeElem(this.step.hold_time, step.hold_time);
	};
	this.showStepRun = function(){
		var step = this.slave.step;
		this.updateFloatElem(this.step.cgoal, step.getOutput(step));
		this.updateTimeElem(this.step.rcountd, step.getReachTimeRest());
		this.updateTimeElem(this.step.hcountd, step.getHoldTimeRest());
	};
	this.showAll = function(){
		this.showChannelIni();
		this.showChannelRun();
	};
	var self = this;
	this.startB.onclick = function(){
		self.slave.start();
	};
	this.stopB.onclick = function(){
		self.slave.stop();
	};
	this.prB.onclick = function(){
		self.pauseResume();
	};
	this.step.prevB.onclick = function(){
		var r = self.slave.goToPrevStep();
		if(r){
			self.blinkS(self.step.prevB);
			self.slave.step.showAll();
		}else{
			self.blinkF(self.step.prevB);
		}
	};
	this.step.nextB.onclick = function(){
		var r = self.slave.goToNextStep();
		if(r){
			self.blinkS(self.step.nextB);
			self.slave.step.showAll();
		}else{
			self.blinkF(self.step.nextB);
		}
	};
	var pcont = cd();
	var picont = cd();
	var prcont = cd();
	var pfcont = cd();
	var pbcont = cd();
	var scont = cd();
	var c1 = cd(); var c2 = cd(); var c3 = cd(); var c4 = cd();
	var re = cd();
	re.innerHTML = "_";
	var pscont = cd();
	a(c1, [this.step.id, re]);
	a(c2, [this.step.goal, this.step.cgoal]);
	a(c3, [this.step.reach_time, this.step.rcountd]);
	a(c4, [this.step.hold_time, this.step.hcountd]);
	a(pscont, [c1, c2, c3, c4]);
	a(scont, [pscont, this.step.prevB, this.step.nextB]);
	a(picont, [this.id, this.method]);
	a(prcont, [this.channel_state, this.uptime, this.result, this.output]);
	a(pfcont, [picont, prcont]);
	a(pbcont, [this.startB, this.stopB, this.prB]);
	a(pcont, [pbcont, pfcont]);
	a(this.container, [pcont, scont]);
	cla([c1, c2, c3, c4], ["tcolumn"]);
	cla([pfcont,  pscont, pbcont],["fl"]);
	cla([pcont, scont, picont, prcont, pfcont],["flcl"]);
	cla([this.id, this.method, this.step.id, this.step.goal, this.step.reach_time, this.step.hold_time],["rcr_ini"]);
	cla([this.result, this.channel_state, this.uptime, this.output, this.step.cgoal, this.step.rcountd, this.step.hcountd],["rcr_run"]);
	cla([this.id, this.method, this.result, this.channel_state, this.uptime, this.output],["fl", "rcr_str"]);
	cla([this.step.id, this.step.goal, this.step.reach_time, this.step.hold_time],["tfield", "rcr_str"]);
	cla([re, this.step.cgoal, this.step.rcountd, this.step.hcountd],["tfield", "rcr_str"]);
	cla(re, "tfieldnv");
	cla([this.result, this.step.cgoal],["rcr_important"]);
	cla(this.container, ["flcr", "rcr_cont"]);
	cla(scont, ["rcr_step"]);
}
