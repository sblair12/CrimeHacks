d3.queue()
	.defer(d3.json, "/data")
	.await(update);
let status = true;
let holder = 0;
var svg;
var svg2;

function update(error, data) {
	console.log(data);
	var margin = {top: 40, right: 10, bottom: 60, left: 10};
	spaceItems(data);

	var width2 = 1100 - 60 - margin.right;
	var height2 = 860 - margin.top - margin.bottom;
	svg2 = d3.select("#onCampus").append("svg")
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
			if (d.gotLocation) {
				return xScale2(d.lon);
			}
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

	svg = d3.select("#offCampus").append("svg")
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

		var crimeTypes = data.map(elem => elem.type);
		console.log(new Set(crimeTypes));

	var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return `<div class="tip-title">${d.location}</div><div class="tip-desc">${d.type}</div>`; });
	tip.direction('n');
	tip.offset([-5, 0]);

	svg.call(tip);
	svg.selectAll("circle").on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	svg2.call(tip);
	svg2.selectAll("circle").on("mouseover", tip.show)
		.on("mouseout", tip.hide);

	d3.select("#ranking-type").on("change", function() {
		var filter = d3.select("#ranking-type").node().value;
		var options = {
			shouldSort: true,
			threshold: 0.6,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 1,
			keys: [
				"type",
				"description"
			]
		};
		var fuse = new Fuse(data, options); // "list" is the item array
		var filtered = fuse.search(filter);
		//var filtered = data.filter((elem) => elem.type.includes(filter.toLowerCase()) || elem.description.includes(filter.toLowerCase()));
		console.log(filtered);
	});
}

function spaceItems(data) {
	var set = new Set();
	var alternate = 0;
	data.forEach((elem, index) => {
		if (set.has(elem.lon*elem.lat)) {
			while(true) {
				console.log(index);
				switch (alternate) {
					case 0:
						elem.lon++;
						break;
					case 1:
						elem.lat++;
						break;
					case 2:
						elem.lon--;
						break;
					case 3:
						elem.lat--;
						break;
					case 4:
						elem.lon++;
						elem.lat++;
						break;
					case 5:
						elem.lon--;
						elem.lat--;
						break;
					case 6:
						elem.lon++;
						elem.lat--;
						break;
					case 7:
						elem.lon--;
						elem.lat++;
						break;
				}
				if (!set.has(elem.lon*elem.lat)) break;
			}
			alternate = (alternate + 1) % 8;
			set.add(elem.lon*elem.lat);
		}
		else {
			set.add(elem.lon*elem.lat);
		}
	});
}

function hider() {
	console.log(status);
	if (status == true){
		let prevClass = d3.select("#prev").attr("class");
		let nextClass = d3.select("#next").attr("class");
		d3.select("#prev").attr("class", prevClass.replace("hidden", ""));
		d3.select("#next").attr("class", nextClass + " hidden");
	}
	else{
		let prevClass = d3.select("#prev").attr("class");
		let nextClass = d3.select("#next").attr("class");
		d3.select("#next").attr("class", nextClass.replace("hidden", ""));
		d3.select("#prev").attr("class", prevClass + " hidden");
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











