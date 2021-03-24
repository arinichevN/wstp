function FieldElemStr(){
	this.container = c("input");
	this.container.type = "text";
	this.container.value = "";
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
			this.func(this.slave, this.container.value);
		}
	};
	cla(this.container, ["f_common"]);
}
