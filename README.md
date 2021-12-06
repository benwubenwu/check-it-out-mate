### Location of Code

Most relevant code is located in one of `index.html` or `/css`. `Chessboardjs-1.0.0`, `/dist`, and `/nouislider` are
all libraries (as well as `d3-chessboard.js`, which we acquired from an open repository). All other code in the /js file
is code that we wrote.

Here is a breakdown of our visualizations:

Chessboard visualization (`chessboard.js`)
- Novel visualization type
- Visualizes an interactive chessboard along with all black and white pieces
- Hovering over a piece allows you to view a description of its movement and capture and displays arrows indicating its movement

Opening Moves visualization (`OpeningVis.js` + `/chessboardjs-1.0.0`)
- Linked view
- Visualizes the top opening moves for both black and white in bar charts and has a corresponding chessboard that animates the corresponding openings
- Hovering over a bar in the chart moves the pieces in the chessboard to its corresponding positions
- Chessboard was implemented by using open-source Javascript library chessboardjs.

Top Players visualization (`PlayerVis.js` + `BrushVis.js`)
- Linked view
- Visualizes the number of FIDE games played by top players over time and the ratings of the top players over time
- Using the brush on the top visualization allows you to focus in on a specific time frame on the bottom visualization
- Hovering over a specific line in the bottom visualization bolds that specific line and greys out the other lines

Top Countries visualization (`CountryVis.js`)
- Visualizes the top chess countries based on its professional players
- Hovering over a line bolds the line and greys out the other lines
- Clicking on a circle on a line shows the average rating of that country for that specific year
- Using the slider above allows you to zone in on a specific time

Link to our website: https://benwubenwu.github.io/check-it-out-mate/#firstPage



### URLs
URL to video:

