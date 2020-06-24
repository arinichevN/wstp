function RuntimeLoggerRow(slave){
	this.slave = slave;
	this.container = cd();
	this.cpB = cb("");
	this.showB = cb("");
	this.clearB = cb("");
	this.canvas = cd();
	this.chart = null;
	this.max_rows = 1;
	this.data = [];//[{x:4000, y:20},{x:4500, y:30},{x:5000, y:60}];
	this.updateStr = function(){
		this.showB.title = trans.get(373);
		this.cpB.title = trans.get(374);
		this.cpB.innerHTML = trans.get(376);
		this.clearB.title = trans.get(380);
		this.clearB.innerHTML = trans.get(381);
	};
	this.setParam = function(max_rows){
		this.max_rows = max_rows;
	};
	this.addItem = function(v){
		this.data.push({x:new Date(v.mark), y:v.value});
		if(this.data.length >= this.max_rows){
			var out = this.data.shift();
		}
		this.chart.data = this.data;
	};
	this.showData = function(){
		this.chart.data = this.data;
		//console.log(this.chart.data);
	};
	this.clearData = function(){
		cleara(this.data);
		this.chart.data = this.data;
	};
	this.showChart = function(){
		clr(this.canvas, ["hdn"]);
		cla(this.canvas, ["chart_cont"]);
		this.showB.title = trans.get(373);
		this.showB.innerHTML = "[-]";
	};
	this.hideChart = function(){
		cla(this.canvas, "hdn");
		clr(this.canvas, ["chart_cont"]);
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
	this.oncleared = function(success){
		if(success){
			blinkSuccess(this.clearB);
			this.clearData();
		}else{
			blinkFailure(this.clearB);
		}
	};
	var self = this;
	this.showB.onclick = function(){
		self.showHideChart();
	};
	this.cpB.onclick = function(){
		self.slave.cpDataToClipboard(self.data);
	};
	this.clearB.onclick = function(){
		self.slave.clearDB();
	};
	var lbcont = cd();
	a(lbcont, [this.showB, this.cpB, this.clearB]);
	a(this.container, [this.canvas, lbcont]);
	
	//cla([this.canvas, lbcont],["chart_cont"]);
	cla(this.container, ["flcr", "rcr_chart"]);
	this.hideChart();
	
	am4core.useTheme(am4themes_animated);
	this.chart = am4core.create(this.canvas, am4charts.XYChart);
	this.chart.paddingRight = 20;
	this.chart.data = this.data;

	var dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
	dateAxis.renderer.grid.template.location = 0;
	
	var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.tooltip.disabled = true;
	valueAxis.renderer.minWidth = 35;
	
	var series = this.chart.series.push(new am4charts.LineSeries());
	series.dataFields.dateX = "x";
	series.dataFields.valueY = "y";
	series.strokeWidth = 2;
	series.tooltipText = "{valueY}";
	
	// set stroke property field
	series.propertyFields.stroke = "color";
	
	this.chart.cursor = new am4charts.XYCursor();
	
	var scrollbarX = new am4core.Scrollbar();
	this.chart.scrollbarX = scrollbarX;
}
