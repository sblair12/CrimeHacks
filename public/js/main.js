d3.queue()
	.defer(d3.json, "/data")
	.await(update);

function update(error, data) {
	console.log(data);
	var margin = {top: 40, right: 10, bottom: 60, left: 60};

	var width = 845 - margin.left - margin.right,
		height = 535 - margin.top - margin.bottom;

	var svg = d3.select("#onCampus").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("id","canvas");
}