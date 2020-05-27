function RuntimeLogger(){
	this.channel_id = null;
	this.interval = null;
	this.max_rows = null;
	this.buf_len = 1;
	this.buf = {arr:[], len:1, i:0};
	this.tbl = "log";
	this.sensor = null;
	this.tmr = null;
	this.enabled = true;
	this.state = OFF;
    this.view = null;
    this.buf = [];
    this.ACTION = {
		SAVE:1,
		GET:2
	};
    this.setParam = function(item, channel_id, sensor, period){
		this.channel_id = channel_id;
		this.interval = item.interval;
		this.max_rows = item.max_rows;
		this.sensor = sensor;
		if(period > this.interval){
			this.buf.len = Math.round(period/this.interval);
		}else{
			this.buf.len = 1;
		}
	};
	this.checkParam = function(){
		if(this.interval === null){console.warn("bad Logger interval"); return false;}
		if(this.max_rows === null){console.warn("bad Logger max_rows"); return false;}
		if(this.buf.len < 1){console.warn("bad Logger buf length"); return false;}
		return true;
	};
	//this.setSource = function(v, func){
		//this.source = v;
		//this.func = func;
	//};
	this.setView = function(view){
		this.view = view;
		this.view.setParam(this.max_rows);
		this.getData();
	};
	this.showAll = function(){
		
	};
	this.reset = function(){
		window.clearInterval(this.tmr);
	    this.tmr = null;
	};
	this.disable = function(){
		this.stop();
		this.enabled = false;
	};
	this.enable = function(){
		this.enabled = true;
	};
    this.start = function(){
		if(!this.enabled) {return;}
		var self = this;
		this.tmr = window.setInterval(function () {
			self.control();
		}, this.interval);
		this.state = INIT;
	};
	this._stop = function(state){
		if(!this.enabled) {return;}
		if(this.state === state) return;
		this.state = state;
	};
	this.stop = function(){
		this._stop(OFF);
	};
	this.emergencyStop = function(){
		this._stop(EOFF);
	};
	this.cpTextToClipboard = function(text){
		var elem = c("textarea");
		//cla(elem, "hdn");
		cla(elem, "clipboard");
		elem.value = text;
		document.body.appendChild(elem);
		elem.focus();
		elem.select();
		try {
			var r = document.execCommand('copy');
			if(!r){
				console.warn("failed to copy to clipboard 1");
			}
			console.log(text);
		} catch (err) {
			console.warn("failed to copy to clipboard 2");
		}
		document.body.removeChild(elem);
	};
	this.dataToText = function(data){
		var text = "";
		for(var i=0;i<data.length;i++){
			text+=data[i].x.getTime().toString() + "\t" + data[i].y.toString() + "\n";
		}
		return text;
	};
	this.cpDataToClipboard = function(data){
		var text = this.dataToText(data);
		this.cpTextToClipboard(text);
	};
	this.saveBuf = function () {
		var r = this.getRowsForDB();
		var data = [
            {
                action: ["save_" + this.tbl],
                param: {channel_id:this.channel_id, max_rows:this.max_rows, rows:this.buf.arr}
            }
        ];
        sendTo(this, data, this.ACTION.SAVE, "server");
    };
    this.getData = function(){
        var data = [
            {
                action: ['get_log'],
                param: {channel_id: this.channel_id}
            }
        ];
        sendTo(this, data, this.ACTION.GET, 'server');
	};
	this.getItemForView = function(db_row){
		var channel_id = parseInt(db_row.channel_id);
		var mark = parseInt(db_row.mark);
		var value = parseFloat(db_row.value);
		if(isNaN(channel_id) || isNaN(mark) || !(checkFloat(value))){
			return {channel_id:null, mark:null, value:null};
		}
		return {channel_id:channel_id, mark:mark, value:value};
	};
    this.confirm = function (action, d, dt_diff) {
		switch(action){
			case this.ACTION.SAVE:
				break;
			case this.ACTION.GET:
				this.view.clearData();
				for (var i = 0; i < d.length; i++) {
					var item = this.getItemForView(d[i]);
					if(item.channel_id !== null){
						this.view.addItem(item);
					}
				}
				this.view.showData();
				break;
			default:
				console.warn("confirm(): unknown action: ", action);
				break;
		}
	};
	this.abort = function (action, data, ind, dt, user) {
		switch(action){
			case this.ACTION.SAVE:
				console.warn("logger: failed to save, ", "channel_id: ", this.channel_id, data);
				break;
			case this.ACTION.GET:
				console.warn("logger: failed to get data from DB, ", "channel_id: ", this.channel_id, data);
				break;
			default:
				console.warn("abort(): unknown action: ", action);
				break;
		}
		
	};
	this.setNewValue = function(v){
		if(this.buf.i < this.buf.len){
			var item = {mark:Date.now(), value:v.value};
			this.buf.arr.push(item);
			this.buf.i++;
		}else{
			this.saveBuf();
			cleara(this.buf.arr);
			this.buf.i = 0;
		}
	};
	this.control = function(){
		switch(this.state){
			case RUN:
				var output = this.sensor.getOutput();
				if(output.tm !== null && output.value !== null){
					if(output.tm !== this.last_tm){
						this.setNewValue(output);
						this.last_tm = output.tm;
					}
				}
				break;
			case OFF:
				break;
			case INIT:
				this.state = RUN;
				break;
		}
	};
}