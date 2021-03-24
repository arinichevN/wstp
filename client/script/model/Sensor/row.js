function SensorRow(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.interval = new FieldElemInt();
    this.remote_id = new FieldElemInt();
    this.peer_id = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.interval.update(this.data.interval);
		this.remote_id.update(this.data.remote_id);
		this.peer_id.update(this.data.peer_id);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.interval.updateStr(trans.get(345));
		this.remote_id.updateStr(trans.get(325));
		this.peer_id.updateStr(trans.get(326));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.intervalChanged = function(me, data){
		me.data.interval = data;
	};
	this.remoteIdChanged = function(me, data){
		me.data.remote_id = data;
	};
	this.peerIdChanged = function(me, data){
		me.data.peer_id = data;
	};
	this.id.setSlave(this, this.idChanged);
	this.interval.setSlave(this, this.intervalChanged);
	this.remote_id.setSlave(this, this.remoteIdChanged);
	this.peer_id.setSlave(this, this.peerIdChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.interval, this.remote_id, this.peer_id]);
}
