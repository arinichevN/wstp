function EMOutRow(){
	this.container = cd();
	this.id = new FieldElemInt();
    this.out = new FieldElemFloat();
    this.data = null;
    this.setData = function(data){
		this.data = data;
		this.id.update(this.data.id);
		this.out.update(this.data.out);
	};
	this.updateStr = function(){
		this.id.updateStr(trans.get(321));
		this.out.updateStr(trans.get(369));
	};
	this.idChanged = function(me, data){
		me.data.id = data;
	};
	this.outChanged = function(me, data){
		me.data.out = data;
	};
	var self = this;
	this.id.setSlave(self, self.idChanged);
	this.out.setSlave(self, self.outChanged);
	cla(this.container, ["r_cont"]);
	a(this.container, [this.id, this.out]);
}
