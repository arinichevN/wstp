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
		for(let i=0;i<this.items.length;i++){
			if(this.items[i].value === v){
				this.container.selectedIndex = i;
			}
		}
	};
	for(let i=0;i<this.items.length;i++){
		let o = c("option");
		if(i===0){
			o.selected = true;	
		}
		o.innerHTML=this.items[i].name;
		a(this.container, o);
	}
	this.container.onchange = () => {
		if(this.func !== null && this.slave !== null){
			this.func(this.slave, this.items[this.container.selectedIndex].value);
		}
	};
	cla(this.container, ["f_common"]);
}
