d3.queue()
	.defer(d3.json, "/data")
	.await(update);
let status = true;
let holder = 0;
function update(error, data) {
	console.log(data);
	var margin = {top: 40, right: 10, bottom: 60, left: 10};

	var width2 = 1100 - 60 - margin.right;
	var height2 = 860 - margin.top - margin.bottom;
	var svg2 = d3.select("#onCampus").append("svg")
		.attr("width", width2)
		.attr("height", height2)
		.attr("id","canvas2");
	var xScale2 = d3.scaleLinear()
		.domain([-90.316390,-90.300687])
		.range([0,width2]);
	var yScale2 = d3.scaleLinear()
		.domain([38.64291, 38.651754])
		.range([height2,0]);
	var svgSaver2 = svg2.selectAll("circle")
		.data(data);
	svgSaver2.enter()
		.append("circle")
		.attr("cx",function (d) {
			if (d.gotLocation) return xScale2(d.lon);
			else return -1;
		})
		.attr("cy",function(d){
			if (d.gotLocation) return yScale2(d.lat);
			else return -1;
		})
		.attr("r",function(d){
			if (d.type.includes("carjacking")){
				return "7"
			}
			else if(d.description.includes("*test*")){
				return "0"
			}
			else{
				return "3"
			}
		})
		.attr("fill",function(d){
			if(d.description.includes("not injured")){
				return "green"
			}
			// else if(d.description.includes("*test*")){
			// 	return "blue"
			// }
			else{
				return "red"
			}
		})
		.on("click",function(d){
			console.log(d.lat + ", " + d.lon)
		});




	var width = 1100 - 60 - margin.right,
		height = 550.74 - margin.top - margin.bottom;

	var svg = d3.select("#offCampus").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id","canvas");

	var xScale = d3.scaleLinear()
		.domain([-90.328869, -90.274651])
		.range([0, width]);
	var yScale = d3.scaleLinear()
		.domain([38.642568,38.661009])
		.range([height, 0]);

	console.log(xScale);
	console.log(yScale(200));
	console.log(xScale(200));

	var svgSaver = svg.selectAll("circle")
		.data(data);
		svgSaver.enter()
		.append("circle")
			.attr("cx",function (d) {
				if (d.gotLocation) return xScale(d.lon);
				else return -1;
			})
			.attr("cy",function(d){
				if (d.gotLocation) return yScale(d.lat);
				else return -1;
			})
			.attr("r",function(d){
				if (d.type.includes("carjacking")){
					return "7"
				}
				else if(d.description.includes("*test*")){
					return "0"
				}
				else{
					return "3"
				}
			})
			.attr("fill",function(d){
				if(d.description.includes("not injured")){
					return "green"
				}
				// else if(d.description.includes("*test*")){
				// 	return "blue"
				// }
				else{
					return "red"
				}
			})
			.on("click",function(d){
				console.log(d.lat + ", " + d.lon)
			});

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.location; });
	tip.direction('n');
	tip.offset([-5, 0]);

	if (status) {
		svg.call(tip);
		svg.selectAll("circle").on("mouseover", tip.show)
			.on("mouseout", tip.hide);
	}
	else {
		svg2.call(tip);
		svg2.selectAll("circle").on("mouseover", tip.show)
			.on("mouseout", tip.hide);
	}


}

function hider() {
	if (status == true){
		d3.select("#onCampus").attr("class","show");
		d3.select("#offCampus").attr("class","hidden");
	}
	else{
		d3.select("#onCampus").attr("class","hidden");
		d3.select("#offCampus").attr("class","show");
	}
	status = !status;
}

function holding(){
	if (document.getElementById("#ranking-type") == "0"){
		console.log("all");
	}
	else if(document.getElementById("#ranking-type") == "1"){
		console.log("1");
	}
	else if(document.getElementById("#ranking-type") == "2"){
		console.log("2");
	}
	else if(document.getElementById("#ranking-type") == "3"){
		console.log("3");
	}
	else if(document.getElementById("#ranking-type") == "4"){
		console.log("4");
	}
}











