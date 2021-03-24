const LANGUAGE_ENG = 0;
const LANGUAGE_RUS = 1;

function Translater() {
	this.dict = [];
	this.active_lang = LANGUAGE_ENG;
	this.init = function () {
		;
	};
	this.addDict = function (v) {
		for (let i = 0; i < v.length; i++) {
			this.dict.push(v[i]);
		}
	};
	this.get = function (id) {
		for (let i = 0; i < this.dict.length; i++) {
			if (this.dict[i].id === id) {
				return this.dict[i].str[this.active_lang];
			}
		}
		return "";
	};
	this.getFrom = function(dict, id){
		for (let i = 0; i < dict.length; i++) {
			if (dict[i].id === id) {
				return dict[i].str[this.active_lang];
			}
		}
		return "";
	};
	this.setLanguage = function(v){
		this.active_lang = v;
	};
	this.getActiveLanguage = function(){
		return this.active_lang;
	};
}

let trans = new Translater();
elem.push(trans);

function LanguageSelectorItem(slave, id, name){
	this.slave = slave;
	this.id = id;
	this.container = cd();
	this.container.innerHTML = name;
	this.selectLang = function(){
		this.slave.selectLang(this);
		this.enable();
	};
	this.disable = function(){
		clr(this.container, "langsel_ienbl");
	};
	this.enable = function(){
		cla(this.container, "langsel_ienbl");
	};
	this.container.onclick = ()=>{
		this.selectLang();
	};
	cla(this.container, "langsel_item");
}

function LanguageSelector(slave){
	this.slave = slave;
	this.config = [{id:LANGUAGE_RUS, name:"rus"}, {id:LANGUAGE_ENG, name:"eng"}];
	this.container = cd();
	this.descrE = cd();
	this.descrE.innerHTML = "lang";
	this.itemCont = cd();
	this.items = [];
	this.build = function(){
		for(let i=0; i<this.config.length; i++){
			let nitem = new LanguageSelectorItem(this, this.config[i].id, this.config[i].name);
			this.items.push(nitem);
			a(this.itemCont, nitem);
		}
	};
	this.selectLang = function(caller){
		this.disableOthers(caller);
		this.slave.setLanguage(caller.id);
		updateStr();
	};
	this.disableOthers = function(skip){
		for(let i=0; i<this.items.length; i++){
			let item = this.items[i];
			if(item === skip){
				continue;
			}
			item.disable();
		}
	};
	this.showItems = function(){
		clr(this.itemCont, "hdn");
		cla(this.descrE, "hdn");
	};
	this.hideItems = function(){
		cla(this.itemCont, "hdn");
		clr(this.descrE, "hdn");
	};
	this.enableItemById = function(id){
		for(let i=0; i<this.items.length; i++){
			let item = this.items[i];
			if(item.id === id){
				item.enable();
				return;
			}
		}
	};
	this.descrE.onclick = ()=>{
		this.showItems();
	};
	this.container.onmouseleave = ()=>{
		this.hideItems();
	};
	this.build();
	this.enableItemById(this.slave.getActiveLanguage());
	this.hideItems();
	a(this.container, [this.descrE, this.itemCont]);
	cla(this.descrE, "langsel_descr");
	cla(this.itemCont, "langsel_icont");
	cla(this.container, "langsel_cont");
}



