function SimpleGroup(header_id) {
	this.header_id = header_id;
    this.container = cd();
    this.headerE = cd();
    this.itemCont = cd();
    this.rowCont = cd();
	this.shE = cd();
	this.shE.innerHTML = "+";
	this.sht = 302;
	this.shE.title = trans.get();
	this.newB = cb("");
	this.delB = cb("");
	this.saveB = cb("");
	this.getB = cb("");
	this.rows = [];
	this.updateStrSh = function(){
		this.shE.title = trans.get(this.sht);
	};
    this.updateStr = function () {
		this.headerE.innerHTML = trans.get(this.header_id);
		this.updateStrSh();
    };
    this.a = function(v){
		a(this.itemCont, v);
	};
	this.showHide = function(){
		if(clc(this.itemCont, "hdn")){
			clr(this.itemCont, "hdn");
			this.shE.innerHTML = "[-]";
			this.sht = 301;
			this.updateStrSh();
		}else{
			cla(this.itemCont, "hdn");
			this.shE.innerHTML = "[+]";
			this.sht = 302;
			this.updateStrSh();
		}
	};
	this.shE.onclick = () => {
		this.showHide();
	};
	let hcont = cd();
	a(hcont, [this.headerE, this.shE]);
    a(this.container, [hcont, this.itemCont]);
    cla(this.headerE, ["gr_head"]);
    cla(this.shE, ["gr_sh"]);
    cla(hcont, ["gr_hcont"]);
    cla(this.itemCont, ["gr_itemCont"]);
    cla(this.container, ["grs"]);
    this.showHide();
}
