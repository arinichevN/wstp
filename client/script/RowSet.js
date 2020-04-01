function RowSet(arr, Item, Row, table_name, header_id) {
	this.arr = arr;
	this.Row = Row;
	this.Item = Item;
	this.tbl = table_name;
	this.header_id = header_id;
    this.container = cd();
    this.headerE = cd();
    this.itemCont = cd();
    this.rowCont = cd();
	this.shE = cd();
	this.shE.innerHTML = "+";
	this.sht = 302;
	this.shE.title = trans.get();
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
		this.headerE.innerHTML = trans.get(this.header_id);
		this.newB.innerHTML = trans.get(303);
		this.delB.innerHTML = trans.get(304);
		this.saveB.innerHTML = trans.get(305);
		this.getB.innerHTML = trans.get(306);
		this.newB.title = trans.get(307);
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
	this.hasSelectedRow = function(){
		for(var i=0;i<this.rows.length;i++){
			if(this.rows[i].selected){
				return true;
			}
		}
		return false;
	};
	this.getNextItemId = function(){
		var out = 0;
		var f = false;
		for(var i=0;i<this.arr.length;i++){
			var id = this.arr[i].id;
			if(!f) {out = id; f=true;}
			if(out < id) {out = id;}
		}
		out++;
		return out;
	};
	this.getLastSelectedItem = function(){
		var f = false;
		var t;
		var oi = -1;
		for(var i=0;i<this.rows.length;i++){
			var row = this.rows[i];
			if(row.selected){
				if(!f) {t=row.selected_time; oi=i; f=true;}
				if(t < row.selected_time){
					t = row.selected_time;
					oi = i;
				}
			}
		}
		if(oi < 0) return null;
		return this.arr[oi];
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
	this.delBControl = function(){
		var r = this.getSelectedRowInd();
		if(r > -1){
			this.delB.disabled = false;
		}else{
			this.delB.disabled = true;
		}
	};
	this.addRow = function(data){
		var self = this;
		var nr = new this.Row();
		nr.setData(data);
		nr.updateStr();
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
		
	};
	this.addItem = function(){
		var nd = new this.Item();
		var lsi = this.getLastSelectedItem();
		if(this.hasSelectedRow() && lsi !== null){
			nd.copyParam(lsi);
		}
		nd.id = this.getNextItemId();
		this.arr.push(nd);

		this.addRow(nd);
	};
	this.addItemFromDBRow = function(db_row){
		var nd = new this.Item();
		if(!nd.setParamFromDBRow(db_row)){
			console.log("bad row:", db_row);
			return;
		}
		this.arr.push(nd);

		this.addRow(nd);
	};
	this.getRowsForDB = function(){
		var out = [];
		for(var i=0;i<this.rows.length;i++){
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
                action: ['save_'+this.tbl],
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
				console.warn("failed to save:", data[0].data);
				cursor_blocker.disable();
				blinkFailure(this.saveB);
				break;
			case this.ACTION.GET:
				console.warn("failed to get:", data[0].data);
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
	a(bcont, [this.newB, this.delB, this.saveB, this.getB]);
	a(this.itemCont, [bcont, this.rowCont]);
    a(this.container, [hcont, this.itemCont]);
    cla(this.headerE, ["gr_head"]);
    cla(this.shE, ["gr_sh"]);
    cla(hcont, ["gr_hcont"]);
    cla(bcont, ["gr_bcont"]);
    cla(this.itemCont, ["gr_itemCont"]);
    cla(this.rowCont, ["gr_rowCont"]);
    cla(this.container, ["gr"]);
    this.hide();
}
