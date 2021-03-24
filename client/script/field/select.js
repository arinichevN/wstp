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
		let vv = false;
		if(v){
			vv = true;
		}
		this.container.checked = vv;
	};
	this.container.onchange = () => {
		if(this.obj !== null){
			this.obj.selected = this.container.checked;
			this.obj.selected_time = Date.now();
		}
		if(this.func !== null && this.slave !== null){
			this.func(this.slave);
		}
	};
	cla(this.container, ["f_common"]);
}
