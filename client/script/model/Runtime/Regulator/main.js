function RuntimeRegulator(){
	this.method = null;
	this.pid = {mode:null, kp:null, ki:null, kd:null, out_min:null, out_max:null, previous_time:null, ptm_set:false, out:null, integral_error:0.0, previous_error:0.0}
	this.pos2 = {mode:null, hys:null, out_min:null, out_max:null, state:INIT};
	this.state = OFF;
	this.output = null;
    this.view = null;
    this.control_func = null;
    this.setParam = function(item, pid, pos2){
		this.method = item.method;
		if(pid!==null) {var lpid = this.pid; lpid.mode = pid.mode; lpid.kp = pid.kp; lpid.ki = pid.ki; lpid.kd = pid.kd; lpid.out_min = pid.out_min; lpid.out_max = pid.out_max; }
		if(pos2!==null) {var lp = this.pos2; lp.mode = pos2.mode; lp.hys = pos2.hys; lp.out_min = pos2.out_min; lp.out_max = pos2.out_max;}
	
	};
    this.checkMethod = function(v){
		switch(v){
			case REG_METHOD_PID:
			case REG_METHOD_POS2:
			case REG_METHOD_POS1:
				return true;
		}
		return false;
	};
	this.checkMode = function(v){
		switch(v){
			case REG_MODE_HEATER:
			case REG_MODE_COOLER:
				return true;
		}
		return false;
	};
	this.checkPID = function(v){
		if(!this.checkMode(v.mode)){console.warn("bad pid mode"); return false;}
		if(v.kp === null){console.warn("bad pid kp"); return false;}
		if(v.ki === null){console.warn("bad pid ki"); return false;}
		if(v.kd === null){console.warn("bad pid kd"); return false;}
		if(v.out_min === null){console.warn("bad pid out_min"); return false;}
		if(v.out_max === null){console.warn("bad pid out_max"); return false;}
		return true;
	};
	this.checkPos2 = function(v){
		if(!this.checkMode(v.mode)){console.warn("bad pos2 mode"); return false;}
		if(v.hys === null){console.warn("bad pos2 hysteresis"); return false;}
		if(v.out_min === null){console.warn("bad pos2 out_min"); return false;}
		if(v.out_max === null){console.warn("bad pos2 out_max"); return false;}
		return true;
	};
	this.checkParam = function(){
		switch(this.method){
			case REG_METHOD_PID:
				if(!this.checkPID(this.pid)){return false;}
				break;
			case REG_METHOD_POS2:
				if(!this.checkPos2(this.pos2)){return false;}
				break;
			case REG_METHOD_POS1:
				break;
			default:
				console.warn("bad reg method");
				return false;
		}
		return true;
	};
	//this.setSource = function(v, func){
		//this.source = v;
		//this.func = func;
	//};
	this.setView = function(view){
		this.view = view;
	};
	this.showAll = function(){
		
	};
	this.getControlFunction = function(){
		switch(this.method){
			case REG_METHOD_PID:
				return this.pidControl;
			case REG_METHOD_POS2:
				return this.pos2Control;
			case REG_METHOD_POS1:
				return this.pos1Control;
		}
		return null;
	};
    this.start = function(){
		this.control_func = this.getControlFunction();
		this.pidReset(this.pid);
		this.pos2Reset(this.pos2);
		this.state = RUN;
	};
	this._stop = function(state){
		if(this.state === state) return;
		this.state = state;
	};
	this.stop = function(){
		this._stop(OFF);
	};
	this.emergencyStop = function(){
		this._stop(EOFF);
	};
	this.getOutput = function(){
		if(this.state === RUN){
			return this.output;
		}
		return null;
	};
	this.pidReset = function(p){
		console.log(this.pid);
		p.integral_error = 0.0;
		p.previous_error = 0.0;
		p.ptm_set = false;
		p.out = null;
	};
	this.pos2Reset = function(p){
		console.log(this.pos2);
		p.state = OUT_MIN;
	};
	this.pidControl = function(goal, input, tm){
		var p = this.pid;
		var now = input.tm;
		var khc = 1;
		if(p.mode === REG_MODE_COOLER) khc = -1;
		if(!p.ptm_set){p.previous_time = now; p.ptm_set = true; p.out = 0.0; return p.out;}
		if(p.previous_time > now){p.previous_time = now; return p.out;}//time loop detected
		var dt = now - p.previous_time;
		var error = goal - input.value;
		var ierror = p.integral_error + error * dt;
		var derror = (error - p.previous_error) / dt;
		//console.log("err: %f, ierr: %f, derr: %f, dt: %f", error, ierror, derror, dt);
		p.out = p.kp * khc * error + p.ki * khc * ierror + p.kd * khc * derror;
		//console.log("pid now: %f sp:%f in:%f out:%f", now, goal, input, out);
	    if(p.out > p.out_max) {p.out = p.out_max; return p.out;}
	    if(p.out < p.out_min) {p.out = p.out_min; return p.out;}
	    //console.log("preverr: %f, ierr: %f, derr: %f, dt: %f", error, ierr, derr, dt);
	    
		p.previous_error = error;
		p.previous_time = now;
		p.integral_error = ierror;
	    return p.out;
	};
	this.pos2Control = function(goal, input, tm){
		var p = this.pos2;
		var out = null;
		var inval = input.value;
		switch (p.state) {
                case OUT_MAX:
                    switch ( p.mode ) {
	                    case REG_MODE_HEATER:
	                        if ( inval > goal + p.hys ) {
	                            p.state = OUT_MIN;
	                        }
	                        break;
	                    case REG_MODE_COOLER:
	                        if ( inval < goal - p.hys ) {
	                            p.state = OUT_MIN;
	                        }
	                        break;
                        default:
					        p.state = FAILURE;
					        return p.state;
                    }
                    out = p.out_max;
                    break;
                case OUT_MIN:
                    switch ( p.mode ) {
	                    case REG_MODE_HEATER:
	                        if ( inval < goal - p.hys ) {
	                            p.state = OUT_MAX;
	                        }
	                        break;
	                    case REG_MODE_COOLER:
	                        if ( inval > goal + p.hys ) {
	                            p.state = OUT_MAX;
	                        }
	                        break;
	                    default:
					        p.state = FAILURE;
					        return item.state;
                    }
                    out = p.out_min;
                    break;
				default:
                    p.state = OUT_MIN;
                    break;
			}
			return out;
	};
	this.pos1Control = function(goal, input, tm){
		return goal;
	};
	this.control = function(goal, input, tm){
		if(this.state === RUN){
			//console.log("reg:", goal, input, this.output);
			this.output = this.control_func(goal, input, tm);
			
		}
	};
}
