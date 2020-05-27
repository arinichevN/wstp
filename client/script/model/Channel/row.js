function ChannelRow(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.em_id = new FieldElemInt();
    this.sensor_id = new FieldElemInt();
    this.step_id = new FieldElemInt();
    this.reg_id = new FieldElemInt();
    this.logger_id = new FieldElemInt();
    this.bem_id = new FieldElemInt();
    this.eem_id = new FieldElemInt();
    this.bem_out_id = new FieldElemInt();
    this.eem_out_id = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.em_id.update(this.data.em_id);
		this.sensor_id.update(this.data.sensor_id);
		this.step_id.update(this.data.step_id);
		this.reg_id.update(this.data.reg_id);
		this.logger_id.update(this.data.logger_id);
		this.bem_id.update(this.data.bem_id);
		this.eem_id.update(this.data.eem_id);
		this.bem_out_id.update(this.data.bem_out_id);
		this.eem_out_id.update(this.data.eem_out_id);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.em_id.updateStr(trans.get(341));
		this.sensor_id.updateStr(trans.get(342));
		this.step_id.updateStr(trans.get(343));
		this.reg_id.updateStr(trans.get(344));
		this.logger_id.updateStr(trans.get(364));
		this.bem_id.updateStr(trans.get(365));
		this.eem_id.updateStr(trans.get(366));
		this.bem_out_id.updateStr(trans.get(367));
		this.eem_out_id.updateStr(trans.get(368));
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
	this.loggerIdChanged = function(me, data){
		me.data.logger_id = data;
	};
	this.bemIdChanged = function(me, data){
		me.data.bem_id = data;
	};
	this.eemIdChanged = function(me, data){
		me.data.eem_id = data;
	};
	this.bemOutIdChanged = function(me, data){
		me.data.bem_out_id = data;
	};
	this.eemOutIdChanged = function(me, data){
		me.data.eem_out_id = data;
	};
	var self = this;
	this.id.setSlave(self, self.idChanged);
	this.em_id.setSlave(self, self.emIdChanged);
	this.sensor_id.setSlave(self, self.sensorIdChanged);
	this.step_id.setSlave(self, self.stepIdChanged);
	this.reg_id.setSlave(self, self.regIdChanged);
	this.logger_id.setSlave(self, self.loggerIdChanged);
	this.bem_id.setSlave(self, self.bemIdChanged);
	this.eem_id.setSlave(self, self.eemIdChanged);
	this.bem_out_id.setSlave(self, self.bemOutIdChanged);
	this.eem_out_id.setSlave(self, self.eemOutIdChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.em_id, this.bem_id, this.bem_out_id, this.eem_id, this.eem_out_id, this.sensor_id, this.reg_id, this.step_id, this.logger_id]);
}
