function RegulatorRow(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.method = new FieldElemEnum(regmethod_list, 1);
    this.pid_id = new FieldElemInt();
    this.pos2_id = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.method.update(this.data.method);
		this.pid_id.update(this.data.pid_id);
		this.pos2_id.update(this.data.pos2_id);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.method.updateStr(trans.get(329));
		this.pid_id.updateStr(trans.get(327));
		this.pos2_id.updateStr(trans.get(328));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.methodChanged = function(me, data){
		me.data.method = data;
	};
	this.pidIdChanged = function(me, data){
		me.data.pid_id = data;
	};
	this.pos2IdChanged = function(me, data){
		me.data.pos2_id = data;
	};
	var self = this;
	this.id.setSlave(self, self.idChanged);
	this.method.setSlave(self, self.methodChanged);
	this.pid_id.setSlave(self, self.pidIdChanged);
	this.pos2_id.setSlave(self, self.pos2IdChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.method, this.pid_id, this.pos2_id]);
}
