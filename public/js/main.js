d3.queue()
	.defer(d3.json, "/data")
	.await(getData);
let globalData;
let globalBounds;
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
let view = "locations";

let coords = [
	{
		x: 100,
		y: 375,
		width: 320,
		height: 330
	},
	{
		x: 110,
		y: 103,
		width: 210,
		height: 255
	},
	{
		x: 116,
		y: 27,
		width: 230,
		height: 75
	},
	{
		x: 320,
		y: 245,
		width: 90,
		height: 115
	},
	{
		x: 345,
		y: 175,
		width: 145,
		height: 65
	},
	{
		x: 347,
		y: 108,
		width: 290,
		height: 65
	},
	{
		x: 415,
		y: 245,
		width: 55,
		height: 115
	},
	{
		x: 505,
		y: 175,
		width: 52,
		height: 80
	},  {
		x: 475,
		y: 258,
		width: 76,
		height: 100
	},
	{
		x: 580,
		y: 175,
		width: 59,
		height: 94
	},
	{
		x: 575,
		y: 275,
		width: 150,
		height: 85
	},
	{
		x: 645,
		y: 110,
		width: 80,
		height: 160
	},
	{
		x: 730,
		y: 200,
		width: 60,
		height: 60
	},
	{
		x: 730,
		y: 270,
		width: 120,
		height: 90
	},
	{
		x: 730,
		y: 270,
		width: 120,
		height: 90
	},
	{
		x: 740,
		y: 105,
		width: 300,
		height: 69
	},
	{
		x: 820,
		y: 200,
		width: 60,
		height: 57
	},
	{
		x: 881,
		y: 260,
		width: 175,
		height: 100
	},
	{
		x: 425,
		y: 375,
		width: 190,
		height: 70
	},
];

function getData (error, data) {
	globalData = data.crimes.filter((elem) => elem.category !== "");
	globalBounds = data.bounds;
	update(globalData);
}

function update(data) {
    if (view === "regions") {
        svg.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("opacity", 0);
        svg2.selectAll("circle")
            .transition()
            .duration(1000)
            .attr("opacity", 0);

        var oranges = ["#fff5eb","#fee7cf","#fdd4ab","#fdb97e","#fd9c51","#f77d2a","#e85e0e","#cc4503","#a33503","#7f2704"];
        var heatScale = d3.scaleQuantize()
			.domain([
				d3.min(globalBounds, d => d.number),
				d3.max(globalBounds, d => d.number)
			])
			.range(oranges);

		var heats = svg2.selectAll("rect")
			.data(globalBounds);
		heats
			.enter()
			.append("rect")
			.merge(heats)
			.attr("x", (d, index) => coords[index].x)
			.attr("y", (d, index) => coords[index].y)
			.attr("width", (d, index) => coords[index].width)
			.attr("height", (d, index) => coords[index].height)
			.attr("transform", "rotate(7)")
			.attr("opacity", 0.6)
			.attr("fill", d => heatScale(d.number))
			.on("mouseover", function() {
				d3.select(this).attr("opacity", 0.8);
			})
			.on("mouseout", function() {
				d3.select(this).attr("opacity", 0.6);
			});

		var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
			return `<div id="tip-title" class="tip-title">${d.name}</div><div id="tip-desc" class="tip-desc">${d.number}</div>`;
		});
		tip.direction('n');
		tip.offset([-5, 0]);

		svg.call(tip);
		svg.selectAll("rect").on("mouseover", tip.show)
			.on("mouseout", tip.hide);

		svg2.call(tip);
		svg2.selectAll("rect").on("mouseover", tip.show)
			.on("mouseout", tip.hide);

        svg2.transition().delay(1500).duration(1000).attr("opacity", 1);
        svg.transition().delay(1500).duration(1000).attr("opacity", 1);
    }
    else {
		svg.selectAll("rect")
			.transition()
			.duration(1000)
			.attr("opacity", 0);
		svg2.selectAll("rect")
			.transition()
			.duration(1000)
			.attr("opacity", 0);

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
            .attr("opacity", 1)
        svgSaver2.exit().transition().delay(500).duration(500).remove();

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
            .attr("opacity", 1)

        svgSaver.exit().transition().delay(500).duration(500).remove();
        svg.transition().delay(1500).duration(1000).attr("opacity", 1);

        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return `<div class="tip-title">${d.location}</div><div class="tip-desc">${(d.category === undefined) ? "" : d.category.charAt(0).toUpperCase() + d.category.slice(1)}</div>`; });
        tip.direction('n');
        tip.offset([-5, 0]);

        svg.call(tip);
        svg.selectAll("circle").on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        svg2.call(tip);
        svg2.selectAll("circle").on("mouseover", tip.show)
            .on("mouseout", tip.hide);
    }

	if (status) {
		svg.attr("opacity", 0.15);
	}
	else {
		svg2.attr("opacity", 0.15);
	}

	d3.select("#ranking-type").on("change", filterMatch);
}

function changeView() {
    svg2.transition().duration(1000).attr("opacity", 0.15);
    svg.transition().duration(1000).attr("opacity", 0.15);
    view = d3.select('input[name="options"]:checked').node().value;
    d3.select('#ranking-type').property('value', 'all');
    d3.select('#keywordSearch').property('value', "");
    update(globalData);
}

function filterMatch(e) {
	if (e !== undefined) e.preventDefault();
	var keyword = d3.select("#keywordSearch").node().value;
    var filter = d3.select("#ranking-type").node().value;
	if (filter === "all" && keyword === "") {
		update(globalData);
	}
	else {
		var filtered = (keyword === "") ? globalData : globalData.filter((elem) => elem.description.toLowerCase().includes(keyword.toLowerCase()));
		if (filter === "other") filtered = filtered.filter((elem) => elem.category === "");
		else filtered = (filter === "all") ? filtered : filtered.filter((elem) => elem.type.toLowerCase().includes(filter.toLowerCase()) || elem.description.toLowerCase().includes(filter.toLowerCase()));
		update(filtered);
	}
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











