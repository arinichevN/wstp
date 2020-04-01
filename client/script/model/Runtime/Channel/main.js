function RuntimeChannel(){
	this.id = null;
	this.steps = null;
	this.step_id = null;
	this.em = new RuntimeEM();
    this.sensor = new RuntimeSensor();
    this.step = new RuntimeStep();
    this.reg = new RuntimeRegulator();
    this.precision = 3;
    this.view = null;
    this.state = OFF;
    this.uptime = null;
    this.ut_interval = 500;
    this.tmrut = null;
    this.start_time = null;
    this.setView = function(view){
		this.view = view;
		this.sensor.setView(this.view);
		this.em.setView(this.view);
		this.step.setView(this.view);
		this.reg.setView(this.view);
	};
	this.setParam = function(channel, em, em_peer, sensor, sensor_peer, reg, pid, pos2, steps){
		this.id = channel.id;
		this.step_id = channel.step_id;
		this.em.setParam(em, em_peer);
		this.sensor.setParam(sensor, sensor_peer);
		this.reg.setParam(reg, pid, pos2);
		this.steps = steps;
		this.goToStep(this.step_id);
	};
	this.checkParam = function(){
		return this.em.checkParam && this.sensor.checkParam() && this.reg.checkParam() && this.step.checkParam();
	};
	this.showAll = function(){
		this.sensor.showAll();
		this.em.showAll();
		this.step.showAll();
		this.reg.showAll();
		this.view.showAll();
	};
	this.getRowForDB = function(){
		return {id:this.id};
	};
	this.getUptime = function(){
		switch(this.state){
			case RUN: case PAUSE:
				var now = Date.now();
				var dt = now - this.start_time;
				return dt;
		}
		return null;
	};
	this.startUTTimer = function(){
		var self = this;
		this.tmrut = window.setInterval(function () {
			self.view.showChannelUptime();
		}, this.ut_interval);
	};
	this.reset = function(){
		window.clearInterval(this.tmrut);
		this.tmrut = null;
	};
	this.start = function(){
		switch(this.state){
			case OFF:case EOFF:case FAILURE: break;
			default: return;
		}
		var self = this;
		this.reset();
		this.state = INIT;
		this.sensor.start();
		this.view.showChannelState();
	};
	this._stop = function(state){
		if(this.state === state) return;
		this.sensor.stop();
		this.em.stop();
		this.step.stop();
		this.reg.stop();
		this.reset();
		this.state = state;
		this.view.showChannelState();
	};
	this.stop = function(){
		switch(this.state){
			case OFF:case EOFF:case FAILURE:return;
		}
		this.state = STOPPING;
		this.sensor.stop();
		this.step.stop();
		this.reg.stop();
		this.reset();
		this.em.stop();
		this.view.showChannelState();
	};
	this.emergencyStop = function(){
		this._stop(EOFF);
	};
	this.pause = function(){
		if(this.step.pause()){
			this.state = PAUSING;
			this.reg.stop();
			this.em.stop();
			this.view.showChannelState();
			return true;
		}
		
		return false;
	};
	this.resume = function(){
		if(this.step.resume()){
			this.state = RESUMING;
			this.reg.start();
			this.em.start();
			this.view.showChannelState();
			return true;
		}
		return false;
	};
	
	this.getNextStep = function(){
		return getById(this.steps, this.step.next_id);
	};
	this.getPrevStep = function(){
		var pstep = null;
		var cstep = {next_id:this.step_id};
		for(var i=0; i < this.steps.length; i++){
			var cstep = getById(this.steps, cstep.next_id);
			if(cstep === null) {console.warn("no more steps");return null;}
			if(cstep.id === this.step.id) return pstep;
			pstep = cstep;
		}
	};
	this.loadStep = function(dbstep){
		if(dbstep === null){
			console.warn("step not found");
			return false;
		}
		var tstep = new RuntimeStep();
		tstep.setParam(dbstep);
		if(!tstep.checkParam()){
			return false;
		}
		this.step.setParam(dbstep);
		return true;
	};
	this.goToStep = function(step_id){
		var step = getById(this.steps, step_id);
		return this.loadStep(step);
	};
	this.goToPrevStep = function(){
		var step = this.getPrevStep();
		return this.loadStep(step);
	};
	this.goToNextStep = function(){
		var step = this.getNextStep();
		return this.loadStep(step);
	};
    this.onSensorUpdate = function(){
		this.reg.control(this.step.getOutput(), this.sensor.output, this.sensor.tm);
	};
	this.onStepFinish = function(){
		if(this.goToStep(this.step.next_id)){
			this.step.showAll();
			this.step.start();
		}else{
			this.stop();
		}
	};
	this.onSensorFailure = function(){
		this.emergencyStop();
	};
	this.onSensorStarted = function(){
		this.em.start();
	};
	this.onEMFailure = function(){
		this.emergencyStop();
	};
	this.onEMStarted = function(){
		switch(this.state){
			case INIT:
				this.step.start();
				this.reg.start();
				this.start_time = Date.now();
				this.startUTTimer();
				this.state = RUN;
				this.view.showChannelState();
				break;
			case RESUMING:
				this.state = RUN;
				this.view.showChannelState();
				break;
			default:break;
		}
		
	};
	this.onEMStoped = function(){
		switch(this.state){
			case PAUSING:
				this.state = PAUSE;
				this.view.showChannelState();
				break;
			case STOPPING:
				this.state = OFF;
				this.view.showChannelState();
				break;
			default:break;
		}
	};
    var self = this;
    this.sensor.setSlave(self);
    this.em.setSlave(self);
	this.em.setSource(self.reg);
    this.step.setSensor(self.sensor);
    this.step.setSlave(self);
}
