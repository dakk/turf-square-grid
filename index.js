var featurecollection = require('turf-featurecollection');
var point = require('turf-point');
var polygon = require('turf-polygon');
var distance = require('turf-distance');

/**
 * Takes a bounding box and a cell depth and returns a set of square {@link Polygon|polygons} in a grid.
 *
 * @module turf/square-grid
 * @category interpolation
 * @param {Array<number>} extent extent in [minX, minY, maxX, maxY] order
 * @param {Number} cellWidth width of each cell
 * @param {String} units units to use for cellWidth
 * @return {FeatureCollection<Polygon>} grid a grid of polygons
 * @example
 * var extent = [-77.3876953125,38.71980474264239,-76.9482421875,39.027718840211605];
 * var cellWidth = 10;
 * var units = 'miles';
 *
 * var squareGrid = turf.squareGrid(extent, cellWidth, units);
 *
 * //=squareGrid
 */
module.exports = function (bbox, cell, units) {
  var fc = featurecollection([]);
  var xDist = 0.0;

  if (bbox[0] < 0.0 && bbox[2] > 0.0)
    xDist = (distance(point([bbox[0], bbox[1]]), point([0.0, bbox[1]]), units)) 
        + (distance(point([0.0, bbox[1]]), point([bbox[2], bbox[1]]), units));
  else
    xDist = (distance(point([bbox[0], bbox[1]]), point([bbox[2], bbox[1]]), units));

  var xFraction = cell / xDist;
  var cellWidth = xFraction * (bbox[2] - bbox[0]);
  var yFraction = cell / (distance(point([bbox[0], bbox[1]]), point([bbox[0], bbox[3]]), units));
  var cellHeight = yFraction * (bbox[3] - bbox[1]);
  cellWidth = cellHeight;

  var currentX = bbox[0];
  while (currentX <= bbox[2]) {
    var currentY = bbox[1];
    while (currentY <= bbox[3]) {
      var cellPoly = polygon([[
          [currentX, currentY],
          [currentX, currentY+cellHeight],
          [currentX+cellWidth, currentY+cellHeight],
          [currentX+cellWidth, currentY],
          [currentX, currentY]
        ]]);
      fc.features.push(cellPoly);

      currentY += cellHeight;
    }
    currentX += cellWidth;
  }
  
  return fc;
}
