function RuntimeLoggerRow(slave){
	this.slave = slave;
	this.container = cd();
	this.cpB = cb("");
	this.showB = cb("");
	this.canvas = cd();
	this.chart = null;
	this.max_rows = 1;
	var newColor = 'rgb(255, 99, 132)';
	var color = Chart.helpers.color;
    this.config = {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						label: "",
						borderColor: newColor,
						backgroundColor: color('rgb(255, 99, 132)').alpha(0.5).rgbString(),
						fill: false,
						data: [],
					}
				]
			},
			options: {
				title: {
					text: 'Chart.js Time Scale'
				},
				scales: {
					xAxes: [{
						type: 'time',
						time: {
							parser: 'MM/DD/YYYY HH:mm:s',
							// round: 'day'
							tooltipFormat: 'll HH:mm'
						},
						scaleLabel: {
							display: false,
							labelString: ""
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: false,
							labelString: ""
						},
						ticks: {
							min: 0,
							max: 100
						}
					}]
				},
			}
	};
	this.t_offset = 10;
	this.y_max = 100;
	this.y_min = 0;
	this.ticks = this.config.options.scales.yAxes[0].ticks;
	this.updateStr = function(){
		this.showB.title = trans.get(373);
		this.cpB.title = trans.get(374);
		this.cpB.innerHTML = trans.get(376);
	};
	this.setParam = function(max_rows){
		this.max_rows = max_rows;
	};
	this.calcYMax = function(maxv){
		return (Math.round(maxv / this.t_offset) + 1) * this.t_offset;
	};
	this.calcYMin = function(minv){
		return (Math.round(minv / this.t_offset) - 1) * this.t_offset;
	};
	this.setYBoundsForNewItem = function(v){
		if(v > this.ticks.max){
			this.ticks.max = this.calcYMax(v);
		}else if(v < this.ticks.min){
			this.ticks.min =  this.calcYMin(v);
		}
	};
	this.setYBoundsForAllItems = function(){
		var arr = this.config.data.datasets[0].data;
		var minv = null;
		var maxv = null;
		var f = false;
		for(var i=0;i<arr.length;i++){
			var v = arr[i].y;
			if(!f){
				minv = v;
				maxv = v;
				f=true;
				continue;
			}
			if(v > maxv) maxv = v;
			if(v < minv) minv = v;
		}
		if(maxv !== null){
			this.ticks.max = this.calcYMax(maxv);
		}else{
			this.ticks.max = this.y_max;
		}
		if(minv !== null){
			this.ticks.min = this.calcYMin(minv);
		}else{
			this.ticks.min = this.y_min;
		}
	};
	this.setYBoundsForShiftedItem = function(v){
		this.setYBoundsForAllItems(v);
	};
	this.addItem = function(v){
		this.config.data.datasets[0].data.push({x:v.mark, y:v.value});
		this.setYBoundsForNewItem(v.value);
		if(this.config.data.datasets[0].data.length >= this.max_rows){
			var out = this.config.data.datasets[0].data.shift();
			this.setYBoundsForShiftedItem(out.y);
		}
		
	};
	this.showData = function(){
		this.chart.update();
	};
	this.clearData = function(){
		cleara(this.config.data.datasets[0].data);
		this.chart.update();
	};
	this.showChart = function(){
		clr(this.canvas, "hdn");
		this.showB.title = trans.get(373);
		this.showB.innerHTML = "[-]";
	};
	this.hideChart = function(){
		cla(this.canvas, "hdn");
		this.showB.title = trans.get(378);
		this.showB.innerHTML = "[+]";
	};
	this.showHideChart = function(){
		if(clc(this.canvas, "hdn")){
			this.showChart();
		}else{
			this.hideChart();
		}
	};
	var self = this;
	this.showB.onclick = function(){
		self.showHideChart();
	};
	this.cpB.onclick = function(){
		self.slave.cpDataToClipboard(self.config.data.datasets[0].data);
	};
	var lbcont = cd();
	var ccont = c("canvas");
	a(this.canvas, [ccont]);
	a(lbcont, [this.showB, this.cpB]);
	a(this.container, [this.canvas, lbcont]);
	
	cla([ccont],["chart_cont"]);
	cla([this.canvas, lbcont],["flcl"]);
	cla(this.container, ["flcr", "rcr_chart"]);
	this.hideChart();
	this.chart=new Chart(ccont,this.config);
}
