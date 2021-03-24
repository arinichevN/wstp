function FieldElemInt(){
	this.container = c("input");
	this.container.type = "number";
	this.container.value = 0;
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
	this.container.onchange = () => {
		if(this.func !== null && this.slave !== null){
			this.func(this.slave, parseInt(this.container.value));
		}
	};
	cla(this.container, ["f_common", "f_int"]);
}
