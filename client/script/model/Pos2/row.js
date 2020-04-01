function Pos2Row(){
	this.container = cd();
	this.id = new FieldElemInt();
	this.mode = new FieldElemEnum(regmode_list, 1);
    this.hys = new FieldElemFloat();
    this.out_min = new FieldElemFloat();
    this.out_max = new FieldElemFloat();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.mode.update(this.data.mode);
		this.hys.update(this.data.hys);
		this.out_min.update(this.data.out_min);
		this.out_max.update(this.data.out_max);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.mode.updateStr(trans.get(330));
		this.hys.updateStr(trans.get(336));
		this.out_min.updateStr(trans.get(334));
		this.out_max.updateStr(trans.get(335));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.modeChanged = function(me, data){
		me.data.mode = data;
	};
	this.hysChanged = function(me, data){
		me.data.hys = data;
	};
	this.outMinChanged = function(me, data){
		me.data.out_min = data;
	};
	this.outMaxChanged = function(me, data){
		me.data.out_max = data;
	};
	var self = this;
	this.id.setSlave(self, self.idChanged);
	this.mode.setSlave(self, self.modeChanged);
	this.hys.setSlave(self, self.hysChanged);
	this.out_min.setSlave(self, self.outMinChanged);
	this.out_max.setSlave(self, self.outMaxChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.mode, this.hys, this.out_min, this.out_max]);
}
