d3.queue()
	.defer(d3.json, "/data")
	.await(update);

function update(error, data) {

	console.log(data);
	var margin = {top: 40, right: 10, bottom: 60, left: 60};

	var width = 1610 - margin.left - margin.right,
		height = 1111 - margin.top - margin.bottom;

	var svg = d3.select("#offCampus").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id","canvas");

	var xScale = d3.scaleLinear()
		.domain([-90.336088, -90.264236])
		.range([0, width]);
	var yScale = d3.scaleLinear()
		.domain([38.628762, 38.667423])
		.range([height, 0]);

	console.log(xScale);
	console.log(yScale(200));
	console.log(xScale(200));

	var svgSaver = svg.selectAll("circle")
		.data(data);
		svgSaver.enter()
		.append("circle")
			.attr("cx",function (d) {
				return xScale(d.lon);
			})
			.attr("cy",function(d){
				return yScale(d.lat);
			})
			.attr("r",function(d){
				if (d.type.includes("carjacking")){
					return "12"
				}
				else{
					return "5"
				}
			})
			.attr("fill",function(d){
				if(d.description.includes("not injured")){
					return "green"
				}
				else{
					return "red"
				}
			})

}
