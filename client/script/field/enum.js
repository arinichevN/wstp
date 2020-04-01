function FieldElemEnum(items, sz){
	this.container = c("select");	
	s(this.container, "size", sz);
	this.items = items;
	this.value = null;
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
		for(var i=0;i<this.items.length;i++){
			if(this.items[i].value === v){
				this.container.selectedIndex = i;
			}
		}
	};
	for(var i=0;i<this.items.length;i++){
		var o = c("option");
		if(i===0){
			o.selected = true;	
		}
		o.innerHTML=this.items[i].name;
		a(this.container, o);
	}
	var self = this;
	this.container.onchange = function(){
		if(self.func !== null && self.slave !== null){
			self.func(self.slave, self.items[self.container.selectedIndex].value);
		}
	};
	cla(this.container, ["f_common"]);
}
