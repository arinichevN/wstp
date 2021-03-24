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
    this.ACTION = {
		SAVE:1,
		GET:2, 
		CLEAR:3
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
		this.tmr = window.setInterval(() => {
			this.control();
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
		let elem = c("textarea");
		//cla(elem, "hdn");
		cla(elem, "clipboard");
		elem.value = text;
		document.body.appendChild(elem);
		elem.focus();
		elem.select();
		try {
			let r = document.execCommand('copy');
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
		let text = "";
		for(let i=0;i<data.length;i++){
			text+=data[i].x.getTime().toString() + "\t" + data[i].y.toString() + "\n";
		}
		return text;
	};
	this.cpDataToClipboard = function(data){
		let text = this.dataToText(data);
		this.cpTextToClipboard(text);
	};
	this.saveBuf = function () {
		//let r = this.getRowsForDB();
		let data = [
            {
                action: ["save_" + this.tbl],
                param: {channel_id:this.channel_id, max_rows:this.max_rows, rows:this.buf.arr}
            }
        ];
        sendTo(this, data, this.ACTION.SAVE, "server");
    };
    this.getData = function(){
        let data = [
            {
                action: ['get_log'],
                param: {channel_id: this.channel_id}
            }
        ];
        sendTo(this, data, this.ACTION.GET, 'server');
	};
	this.clearDB = function(){
        let data = [
            {
                action: ['clear_log'],
                param: {channel_id: this.channel_id}
            }
        ];
        sendTo(this, data, this.ACTION.CLEAR, 'server');
	};
	this.getItemForView = function(db_row){
		let channel_id = parseInt(db_row.channel_id);
		let mark = parseInt(db_row.mark);
		let value = parseFloat(db_row.value);
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
				for (let i = 0; i < d.length; i++) {
					let item = this.getItemForView(d[i]);
					if(item.channel_id !== null){
						this.view.addItem(item);
					}
				}
				this.view.showData();
				break;
			case this.ACTION.CLEAR:
				this.view.oncleared(true);
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
			case this.ACTION.CLEAR:
				this.view.oncleared(false);
				break;
			default:
				console.warn("abort(): unknown action: ", action);
				break;
		}
		
	};
	this.setNewValue = function(v){
		if(this.buf.i < this.buf.len){
			let item = {mark:Date.now(), value:v.value};
			this.buf.arr.push(item); //console.log("logger new item", item);
			this.buf.i++;
			this.view.addItem(item);
			//this.view.showData();
		}else{
			this.saveBuf();
			cleara(this.buf.arr);
			this.buf.i = 0;
		}
	};
	this.control = function(){//console.log("logger control", this.state, RUN, OFF);
		switch(this.state){
			case RUN:
				let output = this.sensor.getOutput();
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
				this.view.clearData();
				this.state = RUN;
				break;
		}
	};
}
