function FieldElemFloat(){
	this.container = c("input");
	this.container.type = "number";
	this.container.step = 1.111;
	this.container.value = 0.000;
	this.slave = null;
	this.func = null;
	this.updateStr = function(v){
		this.container.title = v;
	};
	this.setSlave = function(slave, func){
		this.slave = slave;
		this.func = func;
	};
	this.update = function(v){
		this.container.value = v;
	};
	
	var self = this;
	this.container.onchange = function(){
		if(self.func !== null && self.slave !== null){
			self.func(self.slave, parseFloat(self.container.value));
		}
	};
	cla(this.container, ["f_common", "f_float"]);
}
