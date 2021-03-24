function RuntimeChannelRowSet(arr, peers, ems, sensors, pids, pos2s, regs, steps, loggers, em_outs, channels, tbl, header_id ) {
	this.arr = arr;
	this.peers = peers;
	this.ems = ems;
	this.sensors = sensors;
	this.pids = pids;
	this.pos2s = pos2s;
	this.regs = regs;
	this.steps = steps;
	this.loggers = loggers;
	this.em_outs = em_outs;
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
	this.util = new RuntimeCommon();
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
		for(let i=0;i<this.rows.length;i++){
			let row = this.rows[i];
			if(row.selected){
				return i;
			}
		}
		return -1;
	};
	this.setRchannelParam = function(rchannel, channel_id){
		let channel = getById(this.channels, channel_id);
		if(channel == null) {console.warn("channel %d not found", channel_id);return false;}
		let reg = getById(this.regs, channel.reg_id);
		if(reg == null) {console.warn("regulator %d not found for channel %d", channel.reg_id, channel_id);return false;}
		
		let logger = getById(this.loggers, channel.logger_id);
		if(logger == null) {console.warn("logger %d not found for channel %d, it will be disabled", channel.logger_id, channel_id);}
		
		let em = getById(this.ems, channel.em_id);
		if(em == null) {console.warn("EM %d not found", channel.em_id, channel_id);return false;}
		
		let bem = getById(this.ems, channel.bem_id);
		let bem_peer = null;
		let bout = null;
		if(bem == null) {console.warn("BEM %d not found for channel %d, it will be disabled", channel.bem_id, channel_id);}
		else {
			bem_peer = getById(this.peers, bem.peer_id); if(bem_peer == null) {console.warn("BEM peer %d not found for channel %d", bem.peer_id, channel_id);return false;}
			bout = getById(this.em_outs, channel.bem_out_id); if(bout == null) {console.warn("BEM output %d not found for channel %d", channel.bem_out_id, channel_id);return false;}
			}
		
		let eem = getById(this.ems, channel.eem_id);
		let eem_peer = null;
		let eout = null;
		if(eem == null) {console.warn("EEM %d not found for channel %d, it will be disabled", channel.eem_id, channel_id);}
		else {
			eem_peer = getById(this.peers, eem.peer_id); if(eem_peer == null) {console.warn("EEM peer %d not found for channel %d", eem.peer_id, channel_id);return false;}
			eout = getById(this.em_outs, channel.eem_out_id); if(eout == null) {console.warn("EEM output %d not found for channel %d", channel.eem_out_id, channel_id);return false;}
			}
		
		let sensor = getById(this.sensors, channel.sensor_id);
		if(sensor == null) {console.warn("sensor %d not found for channel %d", channel.sensor_id, channel_id);return false;}
		let step = getById(this.steps, channel.step_id);
		if(step == null) {console.warn("step %d not found for channel %d", channel.step_id, channel_id);return false;}
		let em_peer = getById(this.peers, em.peer_id);
		if(em_peer == null) {console.warn("em %d peer not found for channel %d", em.peer_id, channel_id);return false;}
		let sensor_peer = getById(this.peers, sensor.peer_id);
		if(sensor_peer == null) {console.warn("sensor %d peer not found for channel %d", sensor.peer_id, channel_id);return false;}
		let pid = null;
		let pos2 = null;
		let pos1 = null;
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
			console.warn("regulation method not found for channel %d", channel_id);
			return false;
		}
		rchannel.setParam(channel, em, em_peer, bem, bem_peer, bout, eem, eem_peer, eout, sensor, sensor_peer, reg, pid, pos2, this.steps, logger);
		return true;
	};
	this.delBControl = function(){
		let r = this.getSelectedRowInd();
		if(r > -1){
			this.delB.disabled = false;
		}else{
			this.delB.disabled = true;
		}
	};
	this.mayAddChannel = function (nchannel){
		let r = true;
		for(let i=0;i<this.arr.length;i++){
			let channel = this.arr[i];
			if(equalSensors(channel.sensor, nchannel.sensor)){
				console.warn("equal Sensors for channels %d and %d", channel.id, nchannel.id);
				r = r && false;
			}
			let em = channel.em;
			if(equalEMs(em, nchannel.em)){
				console.warn("equal EMs for channels %d and %d", channel.id, nchannel.id);
				r = r && false;
			}
			if(nchannel.bem.enabled){
				if(equalEMs(em, nchannel.bem)){
					console.warn("equal EM and BEM for channels %d and %d", channel.id, nchannel.id);
					r = r && false;
				}
			}
			if(nchannel.eem.enabled){
				if(equalEMs(em, nchannel.eem)){
					console.warn("equal EM and EEM for channels %d and %d", channel.id, nchannel.id);
					r = r && false;
				}
			}
			em = channel.bem;
			if(em.enabled){
				if(equalEMs(em, nchannel.em)){
					console.warn("equal BEM and EM for channels %d and %d", channel.id, nchannel.id);
					r = r && false;
				}
				if(nchannel.bem.enabled){
					if(equalEMs(em, nchannel.bem)){
						console.warn("equal BEM and BEM for channels %d and %d", channel.id, nchannel.id);
						r = r && false;
					}
				}
				if(nchannel.eem.enabled){
					if(equalEMs(em, nchannel.eem)){
						console.warn("equal BEM and EEM for channels %d and %d", channel.id, nchannel.id);
						r = r && false;
					}
				}
			}
			em = channel.eem;
			if(em.enabled){
				if(equalEMs(em, nchannel.em)){
					console.warn("equal EEM and EM for channels %d and %d", channel.id, nchannel.id);
					r = r && false;
				}
				if(nchannel.bem.enabled){
					if(equalEMs(em, nchannel.bem)){
						console.warn("equal EEM and BEM for channels %d and %d", channel.id, nchannel.id);
						r = r && false;
					}
				}
				if(nchannel.eem.enabled){
					if(equalEMs(em, nchannel.eem)){
						console.warn("equal EEM and EEM for channels %d and %d", channel.id, nchannel.id);
						r = r && false;
					}
				}
			}
		}
		return r;
	};
	this.addRow = function(channel_id){
		let nd = new RuntimeChannel();
		nd.id = channel_id;
		if(!this.setRchannelParam(nd, nd.id)){
			return false;
		}
		if(!this.mayAddChannel(nd)){
			return false;
		}
		this.arr.push(nd);
		let nr = new RuntimeChannelRow(nd, this.util);
		nr.updateStr();
		nd.setView(nr);
		let row_cont = {selected:false, selected_time:null, container:null};
	    let selectE = new FieldElemSelect();
	    selectE.setSlave(this, this.rowSelected);
	    selectE.setObj(row_cont);
	    selectE.update(false);
	    selectE.updateStr();
	    
	    let rccont = cd();
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
		let channel_id = parseInt(this.chidE.value);
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
		let channel_id = parseInt(db_row.id);
		if(isNaN(channel_id)){
			console.warn("check param:", db_row.id, channel_id);
			return;
		}
		this.addRow(channel_id);
	};
	this.getRowsForDB = function(){
		let out = [];
		for(let i=0;i<this.arr.length;i++){
			let r = this.arr[i].getRowForDB();
			out.push(r);
		}
		return out;
	};
	this.deleteItem = function(){
		while(1){
			let i = this.getSelectedRowInd();
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
		clearc(this.rowCont);
		cleara(this.rows);
	};
	this.saveAll = function(){
		let r = this.getRowsForDB();
		let data = [
            {
                action: ['save_rchannel'],
                param: {rows:r}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SAVE, 'server');
	};
	this.getAll = function(){
        let data = [
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
				for (let i = 0; i < d.length; i++) {
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
	this.shE.onclick = ()=>{
		this.expandHide();
	};
	this.newB.onclick = ()=>{
		this.addItem();
	};
	this.delB.onclick = ()=>{
		this.deleteItem();
	};
	this.saveB.onclick = ()=>{
		this.saveAll();
	};
	this.getB.onclick = ()=>{
		this.getAll();
	};
	this.delBControl();
	let hcont = cd();
	a(hcont, [this.headerE, this.shE]);
	let bcont = cd();
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
