function ChannelRow(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.em_id = new FieldElemInt();
    this.sensor_id = new FieldElemInt();
    this.step_id = new FieldElemInt();
    this.reg_id = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.em_id.update(this.data.em_id);
		this.sensor_id.update(this.data.sensor_id);
		this.step_id.update(this.data.step_id);
		this.reg_id.update(this.data.reg_id);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.em_id.updateStr(trans.get(341));
		this.sensor_id.updateStr(trans.get(342));
		this.step_id.updateStr(trans.get(343));
		this.reg_id.updateStr(trans.get(344));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.emIdChanged = function(me, data){
		me.data.em_id = data;
	};
	this.sensorIdChanged = function(me, data){
		me.data.sensor_id = data;
	};
	this.stepIdChanged = function(me, data){
		me.data.step_id = data;
	};
	this.regIdChanged = function(me, data){
		me.data.reg_id = data;
	};
	var self = this;
	this.id.setSlave(self, self.idChanged);
	this.em_id.setSlave(self, self.emIdChanged);
	this.sensor_id.setSlave(self, self.sensorIdChanged);
	this.step_id.setSlave(self, self.stepIdChanged);
	this.reg_id.setSlave(self, self.regIdChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.em_id, this.sensor_id, this.reg_id, this.step_id]);
}
