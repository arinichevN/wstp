function RuntimeEM(){
	this.id = null;
	this.interval = null;
    this.peer = {ip_addr:null, port:null};
    this.tmr = null;
    this.output = null;
    this.precistion = 3;
    this.source = null;
    this.slave = null;
    this.view = null;
    this.state = OFF;
    this.max_retry = 3;
    this.retry = 0;
    this.ACTION = {SET_GOAL:1};
    this.rs_switch = new RemoteSlaveSwitcher();
    this.setParam = function(item, peer){
		this.id = item.remote_id;	this.interval = item.interval;	this.peer.ip_addr = peer.ip_addr;	this.peer.port = peer.port;
		this.rs_switch.setId(this.id);
		this.rs_switch.setPeer(this.peer);
	};
	this.checkParam = function(){
		if(this.id === null){console.warn("bad EM id"); return false;}
		if(this.interval === null){console.warn("bad EM interval"); return false;}
		if(this.peer.ip_addr === null){console.warn("bad EM peer ip_addr"); return false;}
		if(this.peer.port === null){console.warn("bad EM peer.port"); return false;}
		return true;
	};
	this.setSource = function(v){
		this.source = v;
	};
	this.setSlave = function(v){
		this.slave = v;
	};
	this.setView = function(v){
		this.view = v;
	};
	this.showAll = function(){
		this.view.showOutput(this.output, SUCCESS);
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
	this.reset = function(){
		window.clearInterval(this.tmr);
		this.tmr = null;
		this.output = null;
		this.retry = 0;
		this.view.showOutput(this.output, SUCCESS);
	};
    this.start = function(){
		switch(this.state){case OFF:case EOFF:case FAILURE:break; default:return;}
		this.reset();
		this.rs_switch.remoteStart(this);
		this.state = START_REMOTE;
	};
	this._stop = function(state){
		switch(this.state){case OFF:case EOFF:case FAILURE: return;}
		this.reset();
		this.state = state;
	};
	this.stop = function(){
		switch(this.state){
			case OFF:case EOFF:case FAILURE:
				this.slave.onEMStoped(); return;
		}
		this.rs_switch.remoteStop(this);
		this.state = STOP_REMOTE;
	};
	this.emergencyStop = function(){
		this._stop(EOFF);
	};
	this.onRSlaveStart = function(result){
		if(result){
			var self = this;
			this.tmr = window.setInterval(function () {
				self.remoteSetGoal();
			}, this.interval);
			this.state = RUN;
			this.slave.onEMStarted();
		}else{
			this._stop(FAILURE);
			this.slave.onEMFailure();
			console.warn("EM: failed to start where id = ", this.id);
		}
	};
	this.onRSlaveStop = function(result){
		if(result){
			this._stop(OFF);
			this.slave.onEMStoped();
		}else{
			this._stop(FAILURE);
			this.slave.onEMFailure();
			console.warn("EM: failed to stop where id = ", this.id);
		}
	};
    this.remoteSetGoal = function () {
		this.output = this.source.getOutput();
		var v = this.output;
		if( v=== null || isNaN(v) || !isFinite(v)){
			this.view.showOutput(v, SUCCESS);
			return;
		}
		var pack = acp_buildPackSIF(CMD_SET_CHANNEL_GOAL, this.id, v, this.precision);
        var data = [
            {
                action: ["acp", "set_data"],
                param: {ip_addr: this.peer.ip_addr, port: this.peer.port, packs: pack}
            }
        ];
        sendTo(this, data, this.ACTION.SET_GOAL, "server");
    };

    this.confirm = function (action, d, dt_diff) {
		switch(action){
			case this.ACTION.SET_GOAL:
				this.view.showOutput(this.output, SUCCESS);
				break;
			default:
				console.warn("unknown action");
				break;
		}
	};
	this.abort = function (action, data, ind, dt, user) {
		switch(action){
			case this.ACTION.SET_GOAL:
				if(!this.checkRetry(false)){
					this._stop(FAILURE);
					console.warn("em: no more retry to set goal where id = ", this.id);
					this.slave.onEMFailure();
				}
				this.view.showOutput(this.output, FAILURE);
				console.warn(data[0].data);
				break;
			default:
				console.warn("unknown action");
				break;
		}
		
	};
}
