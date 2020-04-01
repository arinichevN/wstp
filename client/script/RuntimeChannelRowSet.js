function RuntimeChannelRowSet(arr, peers, ems, sensors, pids, pos2s, regs, steps, channels, tbl, header_id ) {
	this.arr = arr;
	this.peers = peers;
	this.ems = ems;
	this.sensors = sensors;
	this.pids = pids;
	this.pos2s = pos2s;
	this.regs = regs;
	this.steps = steps;
	this.channels = channels;
	this.tbl = tbl;
	this.header_id = header_id;
    this.container = cd();
    this.headerE = cd();
    this.itemCont = cd();
    this.rowCont = cd();
	this.shE = cd();
	this.shE.innerHTML = "+";
	this.sht = 302;
	this.shE.title = trans.get();
	this.chidE = c("input");
	this.chidE.type = "number";
	this.chidE.value = 0;
	this.newB = cb("");
	this.delB = cb("");
	this.saveB = cb("");
	this.getB = cb("");
	this.rows = [];
	this.ACTION = {
		GET:1,
		SAVE:2
	};
	this.updateStrSh = function(){
		this.shE.title = trans.get(this.sht);
	};
    this.updateStr = function () {
		this.headerE.innerHTML = trans.get(header_id);
		this.chidE.title = trans.get(346);
		this.newB.innerHTML = trans.get(303);
		this.delB.innerHTML = trans.get(304);
		this.saveB.innerHTML = trans.get(305);
		this.getB.innerHTML = trans.get(306);
		this.newB.title = trans.get(363);
		this.delB.title = trans.get(308);
		this.saveB.title = trans.get(309);
		this.getB.title = trans.get(310);
		this.updateStrSh();
    };
    this.a = function(v){
		a(this.rowCont, v);
	};
	this.expand = function(){
		clr(this.itemCont, "hdn");
		this.shE.innerHTML = "[-]";
		this.sht = 301;
		this.updateStrSh();
	};
	this.hide = function(){
		cla(this.itemCont, "hdn");
		this.shE.innerHTML = "[+]";
		this.sht = 302;
		this.updateStrSh();
	};
	this.expandHide = function(){
		if(clc(this.itemCont, "hdn")){
			this.expand();
		}else{
			this.hide();
		}
	};
	this.rowSelected = function(me){
		me.delBControl();
	};
	this.getSelectedRowInd = function(){
		for(var i=0;i<this.rows.length;i++){
			var row = this.rows[i];
			if(row.selected){
				return i;
			}
		}
		return -1;
	};
	this.setRchannelParam = function(rchannel, channel_id){
		var channel = getById(this.channels, channel_id);
		if(channel == null) {console.warn("channel not found", channel_id);return false;}
		var reg = getById(this.regs, channel.reg_id);
		if(reg == null) {console.warn("regulator not found", channel.reg_id);return false;}
		var em = getById(this.ems, channel.em_id);
		if(em == null) {console.warn("EM not found", channel.em_id);return false;}
		var sensor = getById(this.sensors, channel.sensor_id);
		if(sensor == null) {console.warn("sensor not found", channel.sensor_id);return false;}
		var step = getById(this.steps, channel.step_id);
		if(step == null) {console.warn("step not found", channel.step_id);return false;}
		var em_peer = getById(this.peers, em.peer_id);
		if(em_peer == null) {console.warn("peer not found", channel.peer_id);return false;}
		var sensor_peer = getById(this.peers, sensor.peer_id);
		if(sensor_peer == null) {console.warn("peer not found", channel.peer_id);return false;}
		var pid = null;
		var pos2 = null;
		var pos1 = null;
		switch(reg.method){
			case REG_METHOD_PID:
				pid = getById(this.pids, reg.pid_id);
				break;
			case REG_METHOD_POS2:
				pos2 = getById(this.pos2s, reg.pos2_id);
				break;
			case REG_METHOD_POS1:
				pos1 = 1;
				break;
		}
		if(pid===null && pos2===null && pos1===null){
			console.warn("regulation method not found");
			return false;
		}
		rchannel.setParam(channel, em, em_peer, sensor, sensor_peer, reg, pid, pos2, this.steps);
		return true;
	};
	this.delBControl = function(){
		var r = this.getSelectedRowInd();
		if(r > -1){
			this.delB.disabled = false;
		}else{
			this.delB.disabled = true;
		}
	};
	this.addRow = function(channel_id){
		var self = this;
		var nd = new RuntimeChannel();
		nd.id = channel_id;
		if(!this.setRchannelParam(nd, nd.id)){
			console.warn("check param");
			return false;
		}
		this.arr.push(nd);
		var nr = new RuntimeChannelRow(nd);
		nr.updateStr();
		nd.setView(nr);
		var row_cont = {selected:false, selected_time:null, container:null};
	    var selectE = new FieldElemSelect();
	    selectE.setSlave(self, self.rowSelected);
	    selectE.setObj(row_cont);
	    selectE.update(false);
	    selectE.updateStr();
	    
	    var rccont = cd();
	    cla(rccont, ["rs_rowCont"]);
	    cla(selectE, ["rs_select"]);
		a(rccont, [selectE, nr]);
		row_cont.container = rccont;
		
		this.rows.push(row_cont);
		a(this.rowCont, [row_cont]);
		nd.showAll();
		return true;
	};
	this.addItem = function(){
		var channel_id = parseInt(this.chidE.value);
		if(isNaN(channel_id)){
			console.warn("check param:", db_row.id, channel_id);
			blinkFailure(this.newB);
			return;
		}
		if(!this.addRow(channel_id)){
			blinkFailure(this.newB);
		}
	};
	this.addItemFromDBRow = function(db_row){
		var channel_id = parseInt(db_row.id);
		if(isNaN(channel_id)){
			console.warn("check param:", db_row.id, channel_id);
			return;
		}
		this.addRow(channel_id);
	};
	this.getRowsForDB = function(){
		var out = [];
		for(var i=0;i<this.arr.length;i++){
			var r = this.arr[i].getRowForDB();
			out.push(r);
		}
		return out;
	};
	this.deleteItem = function(){
		while(1){
			var i = this.getSelectedRowInd();
			if(i < 0){
				break;
			}else{
				this.arr.splice(i, 1);
				rme(this.rows[i]);
				this.rows.splice(i,1);
				this.delBControl();
			}
		}
	};
	this.deleteAll = function(){
		cleara(this.arr);
		clearCont(this.rowCont);
		cleara(this.rows);
	};
	this.saveAll = function(){
		var r = this.getRowsForDB();
		var data = [
            {
                action: ['save_rchannel'],
                param: {rows:r}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SAVE, 'server');
	};
	this.getAll = function(){
        var data = [
            {
                action: ['getall'],
                param: {tbl: this.tbl}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, 'server');
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SAVE:
				cursor_blocker.disable();
				blinkSuccess(this.saveB);
				break;
			case this.ACTION.GET:
				this.deleteAll();
				for (var i = 0; i < d.length; i++) {
					this.addItemFromDBRow(d[i]);
				}
				cursor_blocker.disable();
				blinkSuccess(this.getB);
				break;
			default:
				console.warn("confirm: unknown action: ", action);
				break;
         }
         cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.SAVE:
				console.warn("failed to save", data[0].data);
				cursor_blocker.disable();
				blinkFailure(this.saveB);
				break;
			case this.ACTION.GET:
				console.warn("failed to get", data[0].data);
				cursor_blocker.disable();
				blinkFailure(this.getB);
				break;
			default:
				console.warn("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
	this.shE.onclick = function(){
		self.expandHide();
	};
	this.newB.onclick = function(){
		self.addItem();
	};
	this.delB.onclick = function(){
		self.deleteItem();
	};
	this.saveB.onclick = function(){
		self.saveAll();
	};
	this.getB.onclick = function(){
		self.getAll();
	};
	this.delBControl();
	var hcont = cd();
	a(hcont, [this.headerE, this.shE]);
	var bcont = cd();
	a(bcont, [this.chidE, this.newB, this.delB, this.saveB, this.getB]);
	a(this.itemCont, [bcont, this.rowCont]);
    a(this.container, [hcont, this.itemCont]);
    cla(this.headerE, ["gr_head"]);
    cla(this.shE, ["gr_sh"]);
    cla(hcont, ["gr_hcont"]);
    cla(bcont, ["gr_bcont"]);
    cla(this.itemCont, ["gr_itemCont"]);
    cla(this.rowCont, ["gr_rowCont"]);
    cla(this.container, ["grr"]);
    this.expand();
}
