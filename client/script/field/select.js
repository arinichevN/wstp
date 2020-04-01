function FieldElemSelect(){
	this.container = c("input");
	this.container.type = "checkbox";
	this.container.checked = "false";
	this.slave = null;
	this.func = null;
	this.obj = null;
	this.updateStr = function(){
		this.container.title = trans.get(320);
	};
	this.setSlave = function(slave, func){
		this.slave = slave;
		this.func = func;
	};
	this.setObj = function(obj){
		this.obj = obj;
	};
	this.update = function(v){
		var vv = false;
		if(v){
			vv = true;
		}
		this.container.checked = vv;
	};
	
	var self = this;
	this.container.onchange = function(){
		if(self.obj !== null){
			self.obj.selected = self.container.checked;
			self.obj.selected_time = Date.now();
		}
		if(self.func !== null && self.slave !== null){
			self.func(self.slave);
		}
	};
	cla(this.container, ["f_common"]);
}
