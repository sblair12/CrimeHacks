d3.queue()
	.defer(d3.json, "/data")
	.await(getData);
let globalData;
let status = true;
let holder = 0;
var margin = {top: 40, right: 10, bottom: 60, left: 10};

var width = 1100 - 60 - margin.right,
	height = 550.74 - margin.top - margin.bottom;
var svg = d3.select("#offCampus").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("id","canvas");
var width2 = 1100 - 60 - margin.right;
var height2 = 860 - margin.top - margin.bottom;
var svg2 = d3.select("#onCampus").append("svg")
	.attr("width", width2)
	.attr("height", height2)
	.attr("id","canvas2")
	.attr("opacity", 0.15);

let crimeStrings = ["burglary", "theft", "assault", "carjacking", "sexual", "nonviolent"];
//let crimeColors = ["black", "orange", "red", "yellow", ""]
var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
	.domain(crimeStrings);

function getData (error, data) {
	globalData = data;
	update(data);
}

function update(data) {
	console.log(data);
	spaceItems(data);

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
		.merge(svgSaver2)
		.attr("cx",function (d) {
			if (d.gotLocation) {
				return xScale2(d.lon);
			}
			else return -1;
		})
		.attr("cy",function(d){
			if (d.gotLocation) return yScale2(d.lat);
			else return -1;
		})
		.attr("r", 4)
		.attr("fill",function(d){
			return colorScale(d.category);
		})
		.on("click",function(d){
			console.log(d.lat + ", " + d.lon)
		});
	svgSaver2.exit().remove();

	svg2.transition().delay(1500).duration(1000).attr("opacity", 1);

	var xScale = d3.scaleLinear()
		.domain([-90.328869, -90.274651])
		.range([0, width]);
	var yScale = d3.scaleLinear()
		.domain([38.642568,38.661009])
		.range([height, 0]);

	var svgSaver = svg.selectAll("circle")
		.data(data);
		svgSaver.enter()
		.append("circle")
			.merge(svgSaver)

			.attr("cx",function (d) {
				if (d.gotLocation) return xScale(d.lon);
				else return -1;
			})
			.attr("cy",function(d){
				if (d.gotLocation) return yScale(d.lat);
				else return -1;
			})
			.attr("r",4)
			.attr("fill",function(d){
				return colorScale(d.category);
			})
			.on("click",function(d){
				console.log(d.lat + ", " + d.lon)
			});

		svgSaver.exit().remove();

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return `<div class="tip-title">${d.location}</div><div class="tip-desc">${d.type}</div>`; });
	tip.direction('n');
	tip.offset([-5, 0]);

	svg.call(tip);
	svg.selectAll("circle").on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	svg2.call(tip);
	svg2.selectAll("circle").on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	svg.attr("opacity", 0.15);

	d3.select("#ranking-type").on("change", function() {
		var filter = d3.select("#ranking-type").node().value;
		if (filter === "all") {
			update(globalData);
		}
		else {
			// var options = {
			// 	shouldSort: true,
			// 	threshold: 0.6,
			// 	location: 0,
			// 	distance: 100,
			// 	maxPatternLength: 32,
			// 	minMatchCharLength: 1,
			// 	keys: [
			// 		"type",
			// 		"description"
			// 	]
			// };
			// var fuse = new Fuse(globalData, options); // "list" is the item array
			// var filtered = fuse.search(filter);
			var filtered = globalData.filter((elem) => elem.type.toLowerCase().includes(filter.toLowerCase()) || elem.description.toLowerCase().includes(filter.toLowerCase()));
			update(filtered);
		}
	});
}

function spaceItems(data) {
	var set = new Set();

	var offset = 0.000025;
	//var alternate = 0;
	data.forEach((elem, index) => {
		if (elem.gotLocation) {
			if (set.has(elem.lon*elem.lat)) {
				while(true) {
					//console.log(index);
					var random = Math.floor(Math.random() * 8);
					//console.log(random);
					switch (random) {
						case 0:
							elem.lon += offset;
							break;
						case 1:
							elem.lat += offset;
							break;
						case 2:
							elem.lon -= offset;
							break;
						case 3:
							elem.lat -= offset;
							break;
						case 4:
							elem.lon += offset;
							elem.lat += offset;
							break;
						case 5:
							elem.lon -= offset;
							elem.lat -= offset;
							break;
						case 6:
							elem.lon += offset;
							elem.lat -= offset;
							break;
						case 7:
							elem.lon -= offset;
							elem.lat += offset;
							break;
					}
					if (!set.has(elem.lon*elem.lat)) break;
				}
				//alternate = (alternate + 1) % 8;
				set.add(elem.lon*elem.lat);
			}
			else {
				set.add(elem.lon*elem.lat);
			}
		}
	});
}

function hider() {
	if (status == true){
		svg2.transition().duration(1000).attr("opacity", 0.15);
		let prevClass = d3.select("#prev").attr("class");
		let nextClass = d3.select("#next").attr("class");
		d3.select("#prev").attr("class", prevClass.replace("hidden", ""));
		d3.select("#next").attr("class", nextClass + " hidden");
		svg.transition().delay(650).duration(1000).attr("opacity", 1);
	}
	else{
		svg.transition().duration(1000).attr("opacity", 0.15);
		let prevClass = d3.select("#prev").attr("class");
		let nextClass = d3.select("#next").attr("class");
		d3.select("#next").attr("class", nextClass.replace("hidden", ""));
		d3.select("#prev").attr("class", prevClass + " hidden");
		svg2.transition().delay(650).duration(1000).attr("opacity", 1);
	}
	status = !status;
}











