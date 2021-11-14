// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");
let percentFormatter = d3.format(".2%");

let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%d-%m-%y");
let parseYear = d3.timeParse("%Y");

let chessBoard = [
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
];

let openingVis;
let openingData;

let playerVis;
let playerData;

let countryVis;
let countryData;

loadCountryData();

loadOpeningData();

loadPlayerData();

function loadCountryData() {
    d3.csv("data/ratings-by-country.csv", row => {
        row.year = parseYear(parseInt(row.year));
        // console.log(row.year)
        row.rating_standard = +row.rating_standard;
        row.country = row.country;
        return row
    }).then(csv => {

        // Store csv data in global variable
        countryData = csv;
        countryVis = new CountryVis('chart-area-2', countryData);

        let range = document.getElementById('range');

        // created with assistance from noUISlider documentation
        noUiSlider.create(range, {
            range: {
                max: 2021,
                min: 2016
            },

            step: 1,

            start: [2016, 2021],

            connect: true,
        });

        range.noUiSlider.on("update", () => countryVis.updateVis())
        // Draw the visualization for the first time
        countryVis.updateVis();
    });
}

function loadPlayerData() {
	d3.csv("data/fide_historical.csv", row => {
		row.string_date = row.ranking_date;
		row.ranking_date = parseDate(row.ranking_date);
		row.rank = +row.rank;
		row.rating = +row.rating;
		row.games = +row.games;
		row.birth_year = parseYear(row.birth_year);
		return row
	}).then(csv => {
		console.log(csv)
		// Store csv in a global variable
		playerData = csv;
		playerVis = new PlayerVis('chart-area', playerData);
	});
}

function loadOpeningData() {
	d3.csv("data/games.csv", row => {
        row.created_at = +row.created_at;
        row.last_move_at = +row.last_move_at;
        row.turns = +row.turns;
        row.white_rating = +row.white_rating;
        row.black_rating = +row.black_rating;
        row.opening_ply = +row.opening_ply;
		return row
	}).then(csv => {
		console.log(csv)
		// Store csv in a global variable
		openingData = csv;
		openingVis = new OpeningVis('opening-vis', openingData);
	});
}

// (1) Load data with promises

let promises = [
    d3.csv("data/ChessPiecesInformation.csv")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {
    // let perDayData = data[0]
    // let metaData = data[1]
    let chessPiecesInfo = data[0]
    console.log(chessPiecesInfo)
    // error, perDayData, metaData
    // if(error) { console.log(error); }

    //console.log(data)
    let pieceDisplayData = []

    // Clean up Chess Piece Information data
    chessPiecesInfo.forEach(el => {
        let piece = {
            'Name': el.Name,
            'Movement': el.Movement,
            'Capture': el.Capture,
            'StartingPositions': el.StartingPosition.split(`,`)
        }
        pieceDisplayData.push(piece)
    })

    console.log(pieceDisplayData)




    /// Initializing the Chess Board to visualize the different pieces
    let chessboard_pieces = new Chessboard('chessboard_pieces', chessBoard, pieceDisplayData, [])

}

function updateVisualization() {
	// let selectValue = d3.select("#data-type").property("value");
	playerVis.wrangleData();
}
