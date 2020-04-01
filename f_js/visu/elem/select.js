function SelectButton(items, sz, slave){
	this.container = c("select");	
	s(this.container, "size", sz);
	this.items = [];
	this.names = [];
	this.selected = false;
	this.slave = slave;
	for(var i=0;i<items.length;i++){
		var o = c("option");
		if(i===0){
			o.selected = true;
		}
		o.innerHTML=trans.get(items[i]);
		a(this.container, o);
		this.items.push(o);
		this.names.push(items[i]);
	}
	this.getSelectedIndex = function(){
		return this.container.selectedIndex;
	};
	this.updateStr=function(items, title){
		for(var i=0;i<this.items.length;i++){
			this.items[i].innerHTML = items[i];
		}
		this.container.title = title;
	};
	this.select = function(ind){
		if(ind < this.items.length){
			this.items[ind].selected = true;
		}
	};
	this.selecte = function(){
		if(this.selected){
			this.selected = false;
			clr(this.container, ["reg_selected"]);
		}else{
			this.selected = true;
			cla(this.container, ["reg_selected"]);
		}
		this.slave.valElemSelect();
	};
	var self = this;
	this.container.onclick = function(){
		self.selecte();
	};
}
