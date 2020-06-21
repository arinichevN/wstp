function RuntimeChannel(){
	this.id = null;
	this.steps = null;
	this.step_id = null;
	this.em = new RuntimeEM();
	this.bem = new RuntimeEM();//it is active when channel is busy
	this.bout = null;
	this.eem = new RuntimeEM();//it is active in case of error
	this.eout = null;
    this.sensor = new RuntimeSensor();
    this.step = new RuntimeStep();
    this.reg = new RuntimeRegulator();
    this.logger = new RuntimeLogger();
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
		this.logger.setView(this.view.logger);
	};
	this.setParam = function(channel, em, em_peer, bem, bem_peer, bout, eem, eem_peer, eout, sensor, sensor_peer, reg, pid, pos2, steps, logger){
		this.id = channel.id;
		this.step_id = channel.step_id;
		this.em.setParam(em, em_peer);
		if(bem){
			this.bem.setParam(bem, bem_peer);
		}else{
			this.bem.disable();
		}
		this.bout = bout;
		if(eem){
			this.eem.setParam(eem, eem_peer);
		}else{
			this.eem.disable();
		}
		this.eout = eout;
		this.sensor.setParam(sensor, sensor_peer);
		this.reg.setParam(reg, pid, pos2);
		if(logger){
			this.logger.setParam(logger, this.id, this.sensor, LOGGER_PERIOD_MS);
		}else{
			this.logger.disable();
		}
		this.steps = steps;
		this.goToStep(this.step_id);
	};
	
	this.checkParam = function(){
		var r = this.em.checkParam() && this.sensor.checkParam() && this.reg.checkParam() && this.step.checkParam();
		if(this.bem.enabled){
			r = r && this.bem.checkParam();
			if(this.bout === null) {console.warn("BEM output is bad"); r = r && false;}
			if(equalEMs(this.bem, this.em)){
				console.warn("BEM is equal to EM"); r = r && false;
			}
		}
		if(this.eem.enabled){
			r = r && this.eem.checkParam();
			if(this.eout === null) {console.warn("EEM output is bad"); r = r && false;}
			if(equalEMs(this.eem, this.em)){
				console.warn("EEM is equal to EM"); r = r && false;
			}
		}
		if(this.bem.enabled && this.eem.enabled){
			if(equalEMs(this.bem, this.eem)){
				console.warn("EEM is equal to BEM"); r = r && false;
			}
		}
		if(this.logger.enabled){
			r = r && this.logger.checkParam();
		}
		return r;
	};
	this.showAll = function(){
		this.sensor.showAll();
		this.em.showAll();
		this.step.showAll();
		this.reg.showAll();
		this.view.showAll();
	};
	this.setState = function(v){
		this.state = v;
		this.view.showChannelState();
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
		this.setState(INIT);
		this.sensor.start();
	};
	this.stop = function(){
		switch(this.state){
			case OFF:case EOFF:case FAILURE:return;
		}
		this.setState(STOPPING);
		this.sensor.stop();
		this.step.stop();
		this.reg.stop();
		this.reset();
		this.em.stop();
		this.bem.stop();
		this.eem.stop();
	};
	this.emergencyStop = function(){
		if(this.state === EOFF) return;
		this.sensor.stop();
		this.em.stop();
		this.bem.stop();
		this.step.stop();
		this.reg.stop();
		this.reset();
		this.setState(EOFF);
		this.eem.setOutput(this.eout);
	};
	this.pause = function(){
		if(this.step.pause()){
			this.setState(PAUSING);
			this.reg.stop();
			this.em.stop();
			return true;
		}
		return false;
	};
	this.resume = function(){
		if(this.step.resume()){
			this.setState(RESUMING);
			this.reg.start();
			this.em.start();
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
		this.em.setOutput(this.reg.getOutput());
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
		if(this.bem.enabled){
			this.bem.start();
		}
		if(this.eem.enabled){
			this.eem.start();
		}
		if(this.logger.enabled){
			this.logger.start();
		}
	};
	this.onEMFailure = function(caller){
		this.emergencyStop();
	};
	this.onEMStarted = function(caller){
		switch(this.state){
			case INIT:
				this.step.start();
				this.reg.start();
				this.start_time = Date.now();
				this.startUTTimer();
				this.setState(RUN);
				this.bem.setOutput(this.bout);
				break;
			case RESUMING:
				this.setState(RUN);
				this.bem.setOutput(this.bout);
				break;
			default:break;
		}
	};
	this.onEMStoped = function(caller){
		switch(this.state){
			case PAUSING:
				this.setState(PAUSE);
				break;
			case STOPPING:
				if(this.em.state === OFF){
					if(this.bem.enabled && this.bem.state !== OFF) break;
					if(this.eem.enabled && this.eem.state !== OFF) break;
					this.setState(OFF);
				}
				break;
			default:break;
		}
	};
    var self = this;
    this.sensor.setSlave(self);
    this.em.setSlave(self);
    this.bem.setSlave(self);
    this.eem.setSlave(self);
    this.step.setSensor(self.sensor);
    this.step.setSlave(self);
}
