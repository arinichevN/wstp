function PeerRow(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.ip_addr = new FieldElemStr();
    this.port = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.ip_addr.update(this.data.ip_addr);
		this.port.update(this.data.port);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.ip_addr.updateStr(trans.get(322));
		this.port.updateStr(trans.get(323));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.portChanged = function(me, data){
		me.data.port = data;
	};
	this.ip_addrChanged = function(me, data){
		me.data.ip_addr = data;
	};
	this.id.setSlave(this, this.idChanged);
	this.port.setSlave(this, this.portChanged);
	this.ip_addr.setSlave(this, this.ip_addrChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.ip_addr, this.port]);
}
