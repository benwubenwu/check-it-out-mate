// let formatDate = d3.timeFormat("%Y");
// let parseYear = d3.timeParse("%Y");
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class CountryVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;
        // SVG drawing area
        let margin = {top: 40, right: 40, bottom: 60, left: 60};

        vis.width = 600 - margin.left - margin.right,
            vis.height = 500 - margin.top - margin.bottom;

        vis.svg = d3.select("#chart-area-2").append("svg")
            .attr("width", vis.width + margin.left + margin.right)
            .attr("height", vis.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        vis.masterGroup = vis.svg.append('g')

        vis.x = d3.scaleTime()
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xaxis = vis.svg.append("g")
            .attr("class", "x_axis")
            .attr("transform", "translate(0, " + vis.height + ")")

        vis.yaxis = vis.svg.append("g")
            .attr("class", "y_axis")
    }

    showEdition(d) {
        console.log(d)
        document.getElementById("title").innerHTML = "Country: " + d.country;
        document.getElementById('winner').innerText = "Rating: " + d.rating_standard;
        document.getElementById('year').innerText = "Year: " + d.year.getFullYear();
    }
    /*
     * The drawing function
     */

    updateVis() {
    let vis = this;

    let filtered_data = vis.data

    const values = range.noUiSlider.get()

    console.log(values)
    if (values != undefined) {
        console.log(values)
        filtered_data = vis.data.filter(d => d.year >= parseYear(parseInt(values[0])) && d.year <= parseYear(parseInt(values[1])))
    }

    if (vis.data == undefined) {
        return null
    }

    document.getElementById('start').innerText = ("Start: " + formatDate(d3.min(filtered_data, d => {
        // console.log(d.year);
        return d.year
    })))
    document.getElementById('end').innerText = ("End: " + formatDate(d3.max(filtered_data, d => d.year)))

    // let prop = d3.select("#ranking-type").property("value");
    const prop = "rating_standard"

    vis.masterGroup.selectAll("lines").remove();

    vis.y.domain([d3.min(filtered_data, d => d[prop]), d3.max(filtered_data, d => d[prop])]);
    vis.x.domain([d3.min(filtered_data, d => d.year), d3.max(filtered_data, d => d.year)]);

    const line = d3.line()
        .x(d => vis.x(d.year))
        .y(d => vis.y(d[prop]));

    console.log("LENGTH")

    let random_color = () => {
        return Math.floor(Math.random() * 16777215).toString(16);
    }
    const lines = vis.masterGroup.selectAll(".path").data([filtered_data])

    lines.enter()
        .append("path")
        .attr("class", "path")
        .merge(lines)
        .transition()
        .duration(800)
        .attr("d", line)
        .attr("fill", "none")
        .attr('stroke', (d, i) => `#${random_color()}`)

    lines.exit().remove()

    const div = d3.select("#chart-area").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const circles = vis.masterGroup.selectAll("circle").data(filtered_data)
    circles.enter().append('circle')
        .data(filtered_data)
        .attr("fill", "green")
        .merge(circles)
        .on("click", (e, d) => vis.showEdition(d))
        .transition()
        .duration(800)
        .attr("cx", d => vis.x(d.year))
        .attr("cy", d => vis.y(d[prop]))
        .attr("r", 5)

    circles.on("mouseover", function (d) {
        div.style("opacity", 1)
        div.html(d.country)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    circles.exit().remove()

    const xAxis = d3.axisBottom()
        .scale(vis.x)
    const yAxis = d3.axisLeft()
        .scale(vis.y)

    vis.yaxis.transition().duration(800).call(yAxis)
    vis.xaxis.transition().duration(800).call(xAxis)
    }
}