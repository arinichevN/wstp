function RuntimeStep(){
	this.id = null;
	this.goal = null;
	this.reach_time = null;
	this.hold_time = null;
	this.next_id = null;
	this.goal_correction = null;
	this.value_start = null;
	this.state = OFF;
	this.start_time = null;
	this.end_time = null;
	this.rest_time = 0;
    this.tmr = null;
    this.tmrv = null;
    this.precistion = 3;
    this.sensor = null;
    this.slave = null;
    this.view = null;
    this.view_interval = 300;
    this.setParam = function(item){
		var start = false;
		switch(this.state){
			case OFF:case EOFF: 
				break; 
			default:
				this.stop(); start = true; break;
		}
		this.id = item.id;
		this.goal = item.goal;
		this.reach_time = item.reach_time*1000;
		this.hold_time = item.hold_time*1000;
		this.next_id = item.next_id;
		if(start){
			this.start();
		}
	};
	this.checkParam = function(){
		if(this.id === null){console.warn("bad step id"); return false;}
		if(this.goal === null){console.warn("bad step goal"); return false;}
		if(this.reach_time === null){console.warn("bad step reach_time"); return false;}
		if(this.hold_time === null){console.warn("bad step hold_time"); return false;}
		if(this.next_id === null){console.warn("bad step next_id"); return false;}
		return true;
	};
	this.setSensor = function(sensor){
		this.sensor = sensor;
	};
	this.setSlave = function(slave){
		this.slave = slave;
	};
	this.setView = function(view){
		this.view = view;
	};
	this.showAll = function(){
		this.view.showStepIni();
		this.view.showStepRun();
	};
	this.getOutput = function(){
		switch(this.state){
			case REACH:
				var now = Date.now();
				var dt = now - this.start_time;
				//console.log(dt , this.goal_correction , this.value_start);
		        return dt * this.goal_correction + this.value_start;
			case HOLD:
				return this.goal;
		}
		return null;
	};
	this.getReachTimeRest = function(){
		if(this.state === REACH){
			var now = Date.now();
			var dt = this.end_time - now;
			return dt;
		}
		return null;
	};
	this.getHoldTimeRest = function(){
		if(this.state === HOLD){
			var now = Date.now();
			var dt = this.end_time - now;
			return dt;
		}
		return null;
	};
	this.startControl = function(interval){
		var self = this;
		this.start_time = Date.now();
		this.end_time = this.start_time + interval;
		this.tmr = window.setTimeout(function () {
			self.control();
		}, interval);
	};
	this.resumeControl = function(interval){
		var self = this;
		var now = Date.now();
		this.start_time = now + interval;
		this.end_time = this.start_time + interval;
		this.tmr = window.setTimeout(function () {
			self.control();
		}, interval);
	};
	this.startViewTimer = function(){
		var self = this;
		this.tmrv = window.setInterval(function () {
			self.view.showStepRun();
		}, this.view_interval);
	};
	this.done = function(){
		window.clearInterval(this.tmrv);
		this.tmrv = null;
		this.state = DONE;
		this.slave.onStepFinish();
	};
	this.control = function(){
		switch(this.state){
			case REACH:
				if (this.hold_time > 0) {
	                this.startControl(this.hold_time);
	                this.state = HOLD;
	            } else {
					this.done();
	            }
	            break;
	        case HOLD:
		        this.done();
		        break;
		}
	};
	this.reset = function(){
		window.clearTimeout(this.tmr);
		window.clearInterval(this.tmrv);
		this.goal_correction = null;
		this.value_start = null;
		this.state = OFF;
		this.start_time = null;
		this.end_time = null;
		this.rest_time = 0;
	    this.tmr = null;
	    this.tmrv = null;
	};
    this.start = function(){
		switch(this.state){
			case OFF: case DONE: REACH: HOLD:
				this.reset();
				if (this.reach_time > 0) {
					var sout = this.sensor.getOutput();
		            var input = sout.value;
		            if(input === null) {this.state = FAILURE; console.warn("failed to get input");return;}
		            this.goal_correction = 0.0;
		            this.value_start = input;
		            this.goal_correction = ( this.goal - input ) / (this.reach_time);
		            this.startControl(this.reach_time);
		            this.startViewTimer();
		            this.state = REACH;
		        } else if (this.hold_time > 0) {
		            this.startControl(this.hold_time);
		            this.startViewTimer();
		            this.state = HOLD;
		        }else{
					this.done();
				}
				break;
		}
	};
	this._stop = function(state){
		switch(this.state){case OFF:case EOFF:case FAILURE: return;}
		this.reset();
		this.state = state;
		this.view.showStepRun();
	};
	this.stop = function(){
		this._stop(OFF);
	};
	this.emergencyStop = function(){
		this._stop(EOFF);
	};
	this.pause = function(){
		switch(this.state){case OFF:case EOFF: return false;}
		window.clearTimeout(this.tmr);
		window.clearInterval(this.tmrv);
		var now = Date.now();
		this.rest_time = this.end_time - now;
		return true;
	};
	this.resume = function(){
		switch(this.state){
			case OFF:case EOFF: return false;
			case REACH:
				var sout = this.sensor.getOutput();
	            var input = sout.value;
	            if(input === null) {this.state = FAILURE; console.warn("failed to get input");return;}
	            this.goal_correction = 0.0;
	            this.value_start = input;
	            this.goal_correction = ( this.goal - this.value_start ) / (this.rest_time);
				break;
		}
		this.startControl(this.rest_time);
		this.startViewTimer();
		return true;
	};
}
