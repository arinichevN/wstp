function StepRow(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.goal = new FieldElemFloat();
    this.reach_time = new FieldElemInt();
    this.hold_time = new FieldElemInt();
    this.next_id = new FieldElemInt();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.goal.update(this.data.goal);
		this.reach_time.update(this.data.reach_time);
		this.hold_time.update(this.data.hold_time);
		this.next_id.update(this.data.next_id);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.goal.updateStr(trans.get(337));
		this.reach_time.updateStr(trans.get(338));
		this.hold_time.updateStr(trans.get(339));
		this.next_id.updateStr(trans.get(340));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.goalChanged = function(me, data){
		me.data.goal = data;
	};
	this.reachTimeChanged = function(me, data){
		me.data.reach_time = data;
	};
	this.holdTimeChanged = function(me, data){
		me.data.hold_time = data;
	};
	this.nextIdChanged = function(me, data){
		me.data.next_id = data;
	};
	var self = this;
	this.id.setSlave(self, self.idChanged);
	this.goal.setSlave(self, self.goalChanged);
	this.reach_time.setSlave(self, self.reachTimeChanged);
	this.hold_time.setSlave(self, self.holdTimeChanged);
	this.next_id.setSlave(self, self.nextIdChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.goal, this.reach_time, this.hold_time, this.next_id]);
}
