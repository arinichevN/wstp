function LoggerRow(){
	this.container = cd();
	this.id = new FieldElemInt();
    this.interval = new FieldElemInt();
    this.max_rows = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.interval.update(this.data.interval);
		this.max_rows.update(this.data.max_rows);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.interval.updateStr(trans.get(345));
		this.max_rows.updateStr(trans.get(372));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.intervalChanged = function(me, data){
		me.data.interval = data;
	};
	this.maxRowsChanged = function(me, data){
		me.data.max_rows = data;
	};
	this.id.setSlave(this, this.idChanged);
	this.interval.setSlave(this, this.intervalChanged);
	this.max_rows.setSlave(this, this.maxRowsChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.interval, this.max_rows]);
}
