
/*
 * PrioVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class OpeningVis {

    constructor(_parentElement, _data, _player_color) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.player_color = _player_color;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 0, bottom: 120, left: 140 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 325 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // Scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.4)

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(percentFormatter)
            .ticks(5);

        vis.svg.append("g")
            .attr("class", "opening-x-axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "opening-y-axis");

        // Axis title
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -10)
            .text(d => {
                if (vis.player_color == "white") {
                    return "Most Popular First Moves for White"
                } else {
                    return "Most Popular First Moves for Black"
                }
            }
            )
            .attr("style", "font-size: 14px");

        vis.svg.append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
			.attr("x", -vis.height / 2)
			.attr("y", -50)
			.attr("text-anchor", "middle")
            .text("Percentage of Games Played")
            .attr("style", "font-size: 10px");
        
        vis.minRating = d3.min(vis.data, d=>d.white_elo);
        vis.maxRating = d3.max(vis.data, d=>d.white_elo);

        vis.minDate = d3.min(vis.data, d => d.date);
        vis.maxDate = d3.max(vis.data, d => d.date);
        
        vis.slider = d3.sliderBottom();
        vis.slider
            .min(vis.minRating)
            .max(vis.maxRating)
            .width(200)
            .default([vis.minRating, vis.maxRating])
            .fill('#2196f3')
            .on('onchange', val => {
                vis.wrangleData();
            })
            .ticks(5);

        var sliderArea = d3
            .select('#opening-vis-slider')
            .append('svg')
            .attr('width', 300)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(20, 40)');

        sliderArea.append("text")
            .attr("transform", "translate(-15, -15)")
            .text("Rating (Elo)")

        sliderArea.call(vis.slider);

        vis.timeSlider = d3.sliderBottom();
        vis.timeSlider
            .min(vis.minDate)
            .max(vis.maxDate)
            .width(200)
            .default([vis.minDate, vis.maxDate])
            .fill('#2196f3')
            .on('onchange', val => {
                vis.wrangleData();
            })
            .ticks(5)
            .tickFormat(formatDate);

        var timeSliderArea = d3
            .select('#opening-vis-slider')
            .append('svg')
            .attr('width', 300)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(20, 40)');

        timeSliderArea.append("text")
            .attr("transform", "translate(-15, -15)")
            .text("Years")

        timeSliderArea.call(vis.timeSlider);

        var board2 = d3chessboard()
            // .fen(fenstring)
            .size(600)
            .textopacity(0.5)
            // .whitecellcolor("#FFFCED")
            // .blackcellcolor("#424b35")
            .whitecellcolor("#FAFAFA")
            .blackcellcolor("#CCC");

        // d3.select("#opening-moves-tooltip").call(board2);

        var board2 = Chessboard('opening-moves-tooltip', 'start');

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        vis.openingEcoToOpeningName = {};
        vis.data.forEach(d => {
            vis.openingEcoToOpeningName[d.eco] = d.name;
        })

        vis.openingMoveToName = {
            "1. e4 ": "King's Pawn Game",
            "1. d4 ": "Queen's Pawn Game",
            "1. Nf3": "Zukertort Opening",
            "1. c4 ": "English Opening",
            "1. e3 ": "Van't Kruijs Opening",
            "1. d3 ": "Mieses Opening",
            "1. f4 ": "Bird's Opening",
            "1. g3 ": "King's Fianchetto Opening",
            "1. c3 ": "Saragossa Opening",

            "1. e4 e5 ": "Open Game",
            "1. e4 c5 ": "Sicilian Defence",
            "1. d4 d5 ": "Queen's Pawn Game",
            "1. e4 e6 ": "French Defence",
            "1. d4 Nf6": "Indian Defence",
            "1. e4 d5 ": "Scandinavian Defense",
            "1. Nf3 d5": "Réti Opening",
            "1. c3 b6 ": "Saragossa Opening",
            "1. g3 d5 ": "King's Fianchetto Opening",
            "1. g3 c5 ": "King's Fianchetto Opening",
            "1. e3 d5 ": "Van't Kruijs Opening"
        };

        let arr = vis.slider.value();
        vis.minRating = arr[0]
        vis.maxRating = arr[1]

        let timeArr = vis.timeSlider.value();
        vis.minDate = timeArr[0];
        vis.maxDate = timeArr[1];

        vis.displayData = vis.data.filter(d => d.white_elo >= vis.minRating && d.white_elo <= vis.maxRating);
        vis.displayData = vis.displayData.filter(d => d.date >= vis.minDate && d.date <= vis.maxDate);
        // vis.displayData = d3.rollup(vis.displayData, v => v.length, d => d.name)
        if (vis.player_color == "white") {
            vis.displayData = d3.rollup(vis.displayData, v => v.length, d => d.moves.slice(0, 6));
        }
        else {
            vis.displayData = d3.rollup(vis.displayData, v => v.length, d => d.moves.slice(0, 9));
        }
        

        vis.displayData = Array.from(vis.displayData, ([name, value]) => ({ name, value }));
        vis.displayData.sort((a, b) => b.value - a.value);
        vis.sum = 0
        vis.displayData.forEach(d => vis.sum += d.value);

        vis.displayData = vis.displayData.slice(0, 5)
        // Update the visualization
        vis.updateVis();
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domains
        // Click button to show moves, opening name, opening eco
        vis.y.domain([0, d3.max(vis.displayData, d => d.value) / vis.sum]);
        vis.x.domain(d3.map(vis.displayData, d => d.name))
        let bars = vis.svg.selectAll(".bar")
            .data(this.displayData);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "#FFFCED")
            .attr("stroke", "#424b35")
            .attr("stroke-width", 1.5)
            .on("mouseover", vis.showBoard)
            .on("mouseout", vis.hideBoard)
            .merge(bars)
            .transition()
            .attr("width", vis.x.bandwidth())
            .attr("height", function (d) {
                return vis.height - vis.y(d.value / vis.sum);
            })
            .attr("x", function (d) {
                return vis.x(d.name);
            })
            .attr("y", function (d) {
                return vis.y(d.value / vis.sum);
            });

        bars.exit().remove();

        // Call axis function with the new domain
        vis.svg.select(".opening-y-axis").call(vis.yAxis);
        // TODO: adjust axis labels
        vis.svg.select(".opening-x-axis").call(vis.xAxis)
            .selectAll("text")
            .text(d => vis.openingMoveToName[d])
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });
    }


    onSelectionChange(selectionStart, selectionEnd) {
        let vis = this;


        // Filter original unfiltered data depending on selected time period (brush)

        // *** TO-DO ***
        //vis.filteredData = ...

        vis.filteredData = vis.data.filter(function (d) {
            return d.time >= selectionStart && d.time <= selectionEnd;
        });


        vis.wrangleData();
    }

    showBoard(event, d) {
        this.openingMoveToFenString = {
            "1. e4 ": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
            "1. d4 ": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
            "1. Nf3": "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1",
            "1. c4 ": "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 1",
            "1. e3 ": "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
            "1. d3 ": "rnbqkbnr/pppppppp/8/8/8/3P4/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
            "1. f4 ": "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR w KQkq - 0 1",
            "1. g3 ": "rnbqkbnr/pppppppp/8/8/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 1",
            "1. c3 ": "rnbqkbnr/pppppppp/8/8/8/2P5/PP1PPPPP/RNBQKBNR w KQkq - 0 1",

            "1. e4 e5 ": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
            "1. e4 c5 ": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
            "1. d4 d5 ": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
            "1. e4 e6 ": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
            "1. d4 Nf6": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 1",
            "1. e4 d5 ": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1",
            "1. Nf3 d5": "rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1",
            "1. c3 b6 ": "rnbqkbnr/p1pppppp/1p6/8/8/2P5/PP1PPPPP/RNBQKBNR w KQkq - 0 1",
            "1. g3 d5 ": "rnbqkbnr/ppp1pppp/8/3p4/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 1",
            "1. g3 c5 ": "rnbqkbnr/pp1ppppp/8/2p5/8/6P1/PPPPPP1P/RNBQKBNR w KQkq - 0 1",
            "1. e3 d5 ": "rnbqkbnr/ppp1pppp/8/3p4/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
        };

        var fenstring = this.openingMoveToFenString[d.name]
        // var board2 = d3chessboard()
        //     .fen(fenstring)
        //     .size(600)
        //     .textopacity(0.5)
        //     // .whitecellcolor("#FFFCED")
        //     // .blackcellcolor("#424b35");
        //     .whitecellcolor("#FAFAFA")
        //     .blackcellcolor("#CCC");

        // d3.select("#opening-moves-tooltip").call(board2);
        var config = {
            position: fenstring
        }
        var board2 = Chessboard('opening-moves-tooltip', 'start');
        // White's first moves
        if (d.name == "1. e4 ") {
            board2.move('e2-e4')
        }
        else if (d.name == "1. d4 ") {
            board2.move('d2-d4')
        }
        else if (d.name == "1. Nf3") {
            board2.move('g1-f3')
        }
        else if (d.name == "1. c4 ") {
            board2.move('c2-c4')
        }
        else if (d.name == "1. e3 ") {
            board2.move('e2-e3')
        }
        else if (d.name == "1. d3 ") {
            board2.move('d2-d3')
        }
        else if (d.name == "1. f4 ") {
            board2.move('f2-f4')
        }
        else if (d.name == "1. g3 ") {
            board2.move('g2-g3')
        }
        else if (d.name == "1. c3 ") {
            board2.move('c2-d3')
        }
        // Black's first moves
        if (d.name == "1. e4 e5 ") {
            board2.move('e2-e4')
            board2.move('e7-e5')
        }
        else if (d.name == "1. e4 c5 ") {
            board2.move('e2-e4')
            board2.move('c7-c5')
        }
        else if (d.name == "1. d4 d5 ") {
            board2.move('d2-d4')
            board2.move('d7-d5')
        }
        else if (d.name == "1. e4 e6 ") {
            board2.move('e2-e4')
            board2.move('e7-e6')
        }
        else if (d.name == "1. d4 Nf6") {
            board2.move('d2-d4')
            board2.move('g8-f6')
        }
        else if (d.name == "1. e4 d5 ") {
            board2.move('e2-e4')
            board2.move('d7-d5')
        }
        else if (d.name == "1. Nf3 d5") {
            board2.move('g1-f3')
            board2.move('d7-d5')
        }
        else if (d.name == "1. c3 b6 ") {
            board2.move('c2-c3')
            board2.move('b7-b6')
        }
        else if (d.name == "1. g3 d5 ") {
            board2.move('g2-g3')
            board2.move('d7-d5')
        }
        else if (d.name == "1. g3 c5 ") {
            board2.move('g2-g3')
            board2.move('c7-c5')
        }
        else if (d.name == "1. e3 d5 ") {
            board2.move('e2-e3')
            board2.move('d7-d5')
        }


        

        d3.select(this)
            .attr('stroke-width', '2px')
            .attr('stroke', 'black')
            .attr('fill', '#424b35')
    }

    hideBoard(event, d) {
        // d3.select("#opening-moves-tooltip")
        //     .attr("style", "display: none");
        
        d3.select(this)
            .attr('stroke-width', '1.5')
            .attr('fill', '#FFFCED')
    }
}