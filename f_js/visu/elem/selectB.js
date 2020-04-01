function SelectSButton(){
	this.container = cb("");	
	this.items = null;
	this.ind = null;
	this.container.title = "";
	this.ind = -1;
	this.container.innerHTML = "";

	this.selectItem = function(item){
		for(var i=0;i<this.items.length;i++){
			if(this.items[i] === item){
				this.container.innerHTML = this.items[i];
				this.ind = i;
				return;
			}
		}
		if(this.items.length){
			this.ind = 0;
			this.container.innerHTML = this.items[this.ind];
		}
	};
	this.updateStr=function(items, title){
		this.items = items;
		if(this.items.length){
			if(this.ind >= 0 && this.ind < this.items.length){
				this.container.innerHTML = this.items[this.ind];
			}else{
				this.ind = 0;
				this.container.innerHTML = this.items[this.ind];
			}
		}else{
			this.ind = null;
			this.container.innerHTML = "";
		}
		this.container.title = title;
	};
	this.change = function(){
		if(this.ind < this.items.length-1){
			this.ind++;
			this.container.innerHTML = this.items[this.ind];
		}else{
			this.ind = 0;
			this.container.innerHTML = this.items[this.ind];
		}
	};
	var self = this;
	this.container.onclick = function(){
		self.change();
	};
}
