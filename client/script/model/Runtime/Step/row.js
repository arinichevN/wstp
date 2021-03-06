function RuntimeStepRow(slave, util){
	this.slave = slave;
	this.util = util;
	this.container = cd();
	this.id = cd();
	this.goal = cd();
	this.cgoal = cd();
	this.reach_time = cd();
	this.hold_time = cd();
	this.rcountd = cd();
	this.hcountd = cd();
	this.prevB = cb();
	this.prevB.innerHTML = "&leftarrow;";
	this.nextB = cb();
	this.nextB.innerHTML = "&rightarrow;";
    this.UNKNOWN_STR = "&empty;";
    this.blink_tm = 270;
    this.precision = 2;
	this.updateStr = function(){
		this.container.title = trans.get(379);
		this.id.title = trans.get(321);
		this.goal.title = trans.get(337);
		this.cgoal.title = trans.get(357);
		this.reach_time.title = trans.get(348);
		this.hold_time.title = trans.get(349);
		this.rcountd.title = trans.get(350);
		this.hcountd.title = trans.get(351);
		this.prevB.title = trans.get(362);
		this.nextB.title = trans.get(356);
	};
	this.showIni = function(){
		let step = this.slave.step;
		this.util.updateElem(this.id, step.id);
		this.util.updateFloatElem(this.goal, step.goal);
		this.util.updateTimeElem(this.reach_time, step.reach_time);
		this.util.updateTimeElem(this.hold_time, step.hold_time);
	};
	this.showRun = function(){
		let step = this.slave.step;
		this.util.updateFloatElem(this.cgoal, step.getOutput(step));
		this.util.updateTimeElem(this.rcountd, step.getReachTimeRest());
		this.util.updateTimeElem(this.hcountd, step.getHoldTimeRest());
	};
	this.prevB.onclick = () => {
		let r = this.slave.goToPrevStep();
		if(r){
			this.util.blinkS(this.prevB);
			this.slave.showAll();
		}else{
			this.util.blinkF(this.prevB);
		}
	};
	this.nextB.onclick = () => {
		let r = this.slave.goToNextStep();
		if(r){
			this.util.blinkS(this.nextB);
			this.slave.showAll();
		}else{
			this.util.blinkF(this.nextB);
		}
	};
	
	let scont = cd();
	let c1 = cd(); let c2 = cd(); let c3 = cd(); let c4 = cd();
	let re = cd();
	re.innerHTML = "_";
	let pscont = cd();
	a(c1, [this.id, re]);
	a(c2, [this.goal, this.cgoal]);
	a(c3, [this.reach_time, this.rcountd]);
	a(c4, [this.hold_time, this.hcountd]);
	a(pscont, [c1, c2, c3, c4]);
	a(this.container, [pscont, this.prevB, this.nextB]);
	

	cla([c1, c2, c3, c4], ["tcolumn"]);
	cla([pscont],["fl"]);
	cla([this.container],["flcl", "rcr_step"]);
	cla([this.id, this.goal, this.reach_time, this.hold_time],["rcr_ini"]);
	cla([this.cgoal, this.rcountd, this.hcountd],["rcr_run"]);
	cla([this.id, this.goal, this.reach_time, this.hold_time],["tfield", "rcr_str"]);
	cla([re, this.cgoal, this.rcountd, this.hcountd],["tfield", "rcr_str"]);
	cla(re, "tfieldnv");
	cla([this.cgoal],["rcr_important"]);
}
