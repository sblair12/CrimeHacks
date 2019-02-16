d3.queue()
	.defer(d3.json, "/data")
	.await(update);

function update(error, data) {

	console.log(data);
	var margin = {top: 40, right: 10, bottom: 60, left: 60};

	var width = 1610 - margin.left - margin.right,
		height = 1111 - margin.top - margin.bottom;

	var svg = d3.select("#offCampus").append("svg")
		.attr("width", 1610)
		.attr("height", 1111)
		.attr("id","canvas");

	var svgSaver = svg.selectAll("circle")
		.data(data);
		svgSaver.enter()
		.append("circle")
			.attr("cx",function (d) {
				return (d.lon+90.336017)*(15462.3393)
			})
			.attr("cy",function(d){
				return (38.667423-d.lat)*(41644.034)
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
