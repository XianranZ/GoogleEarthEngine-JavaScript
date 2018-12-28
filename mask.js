//author: xianranzhang
//date: 2018-12-28

//locate the point
var nanjingPoint = /* color: #d63000 */ee.Geometry.Point([118.7786, 32.0438]);

//load an imagecollection
var nanjingCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
.filterDate('2017-10-01', '2017-10-31')
.filterBounds(nanjingPoint)
.sort('CLOUD_COVER', true);

//selece an image with the lowest cloudiness
var nanjing = nanjingCollection.first();
print ('Nanjing:', nanjing);
Map.centerObject(nanjingPoint, 8);
//Map.addLayer(nanjing, {bands: ['B5', 'B4', 'B3']}, 'Nanjing');

//compute NDVI
var ndvi = nanjing.normalizedDifference(['B5', 'B4']);
print ('NDVI:', ndvi);
var ndviViz = {min: 0, max: 0.5, palette: ['00FF00', '008000']};
//Map.addLayer(ndvi, ndviViz, 'NDVI');
//Map.addLayer(ndvi, {}, 'NDVI');

//compute NDWI
var ndwi = nanjing.normalizedDifference(['B3', 'B5']);
print ('NDWI:', ndwi);
//var ndwiViz = {min: 0, max: 0.5, palette: ['00FFFF', '0000FF']};
//Map.addLayer(ndwi, ndwiViz, 'NDWI');

//make a mask to display water to find a threshold
var ndwiMasked = ndwi.updateMask(ndwi.lte(0.2));
Map.addLayer(ndwiMasked, {}, 'NDWIMASKED');

//select the infrared band
var b10 = nanjing.select('B10');
Map.addLayer(b10, {}, 'B10');

//mask the water in the infrared band
var bMasked = b10.and(ndwiMasked);
Map.addLayer(bMasked, {}, 'Bmasked');

//find back the value in the infrared band
var bMasked = bMasked.where(bMasked.eq(1), b10);
Map.addLayer(bMasked, {}, 'Bmasked1');
