function Peer(){
	this.id = 0;
	this.ip_addr = "";
    this.port = 0;
    this.copyParam = function(data){
		this.id = data.id;
		this.ip_addr = data.ip_addr;
		this.port = data.port;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.ip_addr = db_row.ip_addr;
		this.port = parseInt(db_row.port);
		if(isNaN(this.id) || isNaN(this.port)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, ip_addr: this.ip_addr, port:this.port};
	};
}
