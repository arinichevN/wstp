function RuntimeSensor(){
	this.id = null;
	this.interval = null;
	this.peer = {ip_addr:null, port:null};
	this.output = {value:null, tm:null};
	this.tmr = null;
	this.slave = null;
	this.view = null;
	this.state = OFF;
	this.last_tm = null;
	this.max_retry = 3;
	this.retry = 0;
	this.setParam = function(item, peer){
		this.id = item.remote_id;	this.interval = item.interval;	this.peer.ip_addr = peer.ip_addr;	this.peer.port = peer.port;
	};
	this.checkParam = function(){
		if(this.id === null){console.warn("bad sensor id"); return false;}
		if(this.interval === null){console.warn("bad sensor interval"); return false;}
		if(this.peer.ip_addr === null){console.warn("bad sensor peer ip_addr"); return false;}
		if(this.peer.port === null){console.warn("bad sensor peer.port"); return false;}
		return true;
	};
	this.setSlave = function(slave){
		this.slave = slave;
	};
	this.setView = function(view){
		this.view = view;
	};
	this.showAll = function(){
		this.view.showResult(this.output);
	};
	this.reset = function(){
		window.clearInterval(this.tmr);
		this.output.value = null; this.output.tm = null;
	    this.tmr = null;
	    this.last_tm = null;
	    this.retry = 0;
	};
	this.start = function(){
		this.reset();
		this.tmr = window.setInterval(() => {
			this.sendRequest();
		}, this.interval);
		this.state = INIT;
	};
	this._stop = function(state){
		switch(this.state){case OFF:case EOFF:case FAILURE: return;}
		this.reset();
		this.state = state;
		this.view.showResult(this.output);
	};
	this.stop = function(){
		this._stop(OFF);
	};
	this.emergencyStop = function(){
		this._stop(EOFF);
	};
	this.getOutput = function(){
		return this.output;
	};
	this.checkRetry = function(success){
		if(this.retry < this.max_retry){
			if(success){
				this.retry = 0;
				return true;
			}else{
				this.retry++;
			}
			return true;
		}
		return false;
	};
    this.updateElem = function(d){
		this.output.value = null;
		this.output.tm = null;
		let success = false;
		let new_val = false;
		let data = null;
		if(d !== null){
			data = acp_parseResponse(d, {id:null, value:null, tv_sec:null, tv_nsec:null, state:null});
			if(data instanceof Array && data.length == 1){
				let id = parseInt(data[0].id);
				let val = parseFloat(data[0].value);
				let tv_sec = parseInt(data[0].tv_sec);
				let tv_nsec = parseInt(data[0].tv_nsec);
				let state = parseInt(data[0].state);
				if(!(isNaN(id) || isNaN(val) || !isFinite(val) || isNaN(tv_sec) || isNaN(tv_nsec) || isNaN(state) || state !== 1 || id !== this.id)){
					this.output.value = val;
					this.output.tm = tv_sec + tv_nsec / 1000000000.0;
					if(this.last_tm !== this.output.tm){
						new_val = true;
						this.last_tm = this.output.tm;
					}
					success = true;
				}
			}
		}
		if(!success){
			if(data instanceof Array && data.length == 1){
				console.warn("failed to read from sensor where id = ", this.id, data[0]);
			}else{
				console.warn("failed to read from sensor where id = ", this.id, d);
			}
		}
		if(new_val){
			this.slave.onSensorUpdate();
		}
		this.view.showResult(this.output);
		if(!this.checkRetry(success)){
			this.emergencyStop();
			this.slave.onSensorFailure();
			console.warn("no more retry to read from sensor where id = ", this.id);
			return;
		}
		if(this.state === INIT && success){
			this.state = RUN;
			this.slave.onSensorStarted();
		}
		
	};
    this.sendRequest = function () {
		let pack = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_NOID_GET_FTS, this.id]);
        let data = [
            {
                action: ["acp", "get_data"],
                param: {ip_addr: this.peer.ip_addr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        sendTo(this, data, 1, "server");
    };
    this.confirm = function (action, d, dt_diff) {
		this.updateElem(d);
	};
	this.abort = function (action, data, ind, dt, user) {
		this.updateElem(null);
		console.warn(data);
	};
}
