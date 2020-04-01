function Sensor(){
	this.id = 0;
	this.interval = 0;
    this.remote_id = 0;
    this.peer_id = 0;
    this.copyParam = function(data){
		this.id = data.id;
		this.interval = data.interval;
		this.remote_id = data.remote_id;
		this.peer_id = data.peer_id;
	};
	this.setParamFromDBRow = function(db_row){
		this.id = parseInt(db_row.id);
		this.interval = parseInt(db_row.interval);
		this.remote_id = parseInt(db_row.remote_id);
		this.peer_id = parseInt(db_row.peer_id);
		if(isNaN(this.id) || isNaN(this.interval) || isNaN(this.remote_id) || isNaN(this.peer_id)){
			return false;
		}
		return true;
	};
	this.getRowForDB = function(){
		return {id:this.id, interval: this.interval, remote_id:this.remote_id, peer_id:this.peer_id};
	};
}
