function RemoteSlaveSwitcher(){
	this.id = null;
	this.peer = null;
	this.slave = null;
	this.ACTION = {GET:1, START:2, STOP:3, SET:4};
    this.GOAL = {
			START:	{command:CMD_.CHANNEL_START,	state:"RUN",	action:this.ACTION.START},
			STOP:	{command:CMD_.CHANNEL_STOP,	state:"OFF",	action:this.ACTION.STOP},
		};
	this.goal = null;
	this.max_retry = 3;
    this.retry = 0;
    this.interval = 500;
    this.setId = function(v){
		this.id = v;
	};
    this.setPeer = function(v){
		this.peer = v;
	};
	this.remoteStart = function(slave){
		this.slave = slave;
		this.goal = this.GOAL.START;
		this.retry = 0;
		this.remoteGetStateDl();
	};
	this.remoteStop = function(slave){
		this.slave = slave;
		this.goal = this.GOAL.STOP;
		this.retry = 0;
		this.remoteGetStateDl();
	};
	this.stop = function(){
		//this.slave = null;
		//this.goal = null;
	//	this.retry = 0;
	};
	this.done = function(result){
		switch(this.goal.action){
			case this.ACTION.START: this.slave.onRSlaveStart(result); break;
			case this.ACTION.STOP: this.slave.onRSlaveStop(result); break;
		}
		this.stop();
	};
	this.checkRetry = function(success){
		if(this.retry < this.max_retry){
			if(success){
				this.retry = 0;
			}else{
				this.retry++;
			}
			return true;
		}
		return false;
	};
	this.remoteCheckState = function(d, expected){
		if(d !== null){
			var data = acp_parseResponse(d, {id:null, state:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].id);
				var state = data[0].state;
				if(!(isNaN(id) || state !== expected || id !== this.id)){
					return true;
				}
			}
		}
		return false;
	};
	this.remoteCommand = function () {
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_SET, this.goal.command, this.id);
        var data = [
            {
                action: ["acp", "set_data"],
                param: {ip_addr: this.peer.ip_addr, port: this.peer.port, packs: pack}
            }
        ];
        sendTo(this, data, this.ACTION.SET, "server");
    };
	this.remoteCommandDl = function(){
		var self = this;
		this.tmrt = window.setTimeout(function () {
			self.remoteCommand();
		}, this.interval);
	};
	this.remoteGetStateDl = function(){
		var self = this;
		this.tmrt = window.setTimeout(function () {
			self.remoteGetState();
		}, this.interval);
	};
    this.remoteGetState = function() {
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, CMD_.GETR_CHANNEL_STATE, this.id);
        var data = [
            {
                action: ["acp", "get_data"],
                param: {ip_addr: this.peer.ip_addr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        sendTo(this, data, this.ACTION.GET, "server");
    };
	this.confirm = function (action, d, dt_diff) {
		switch(action){
			case this.ACTION.GET:
				if(this.remoteCheckState(d, this.goal.state)) {
					this.done(true);
				}else{
					if(this.checkRetry(false)){
						this.remoteCommand();
					}else{
						this.done(false);
					}
				}
				break;
			case this.ACTION.SET:
				this.remoteGetStateDl();
				break;
			default:
				console.warn("unknown action");
				break;
		}
		
	};
	this.abort = function (action, data, ind, dt, user) {
		switch(action){
			case this.ACTION.GET:
				if(this.checkRetry(false)){
					this.remoteGetStateDl();
				}else{
					this.done(false);
				}
				break;
			case this.ACTION.SET:
				if(this.checkRetry(false)){
					this.remoteCommandDl();
				}else{
					this.done(false);
				}
				break;
			default:
				console.warn("unknown action");
				break;
		}
		
	};
}
