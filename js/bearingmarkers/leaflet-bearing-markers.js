/* L.BearingMarkers = L.LayerGroup.extend({
	initialize: function (line, map, options) {
		options = options || {};
		var showAll = Math.min(map.getMaxZoom(), options.showAll || 13);
		var cssClass = options.cssClass || 'bearing-marker';

		var textFunction = options.textFunction || function(bearing, p1, p2, i) {
			return "" + Math.round((bearing + 360) % 360) + "°";
		};

		var zoomLayers = {};
		// Get line coords as an array
		var coords = line;
		if (typeof line.getLatLngs == 'function') {
			coords = line.getLatLngs();
		}
		
		console.log(line);
		
		for (var i = 1; i < coords.length; ++i) {
			var p1 = coords[i - 1];
			var p2 = coords[i];
			var middle = L.latLngBounds(p1, p2).getCenter();

			var bearing = L.GeometryUtil.bearing(p1, p2);
			var text = textFunction.call(this, bearing, p1, p2, i);
    		var iconSize = [4+6*text.toString().length, 16];
			var icon = L.divIcon({ className: cssClass, html: text, iconSize: iconSize });
			var marker = L.marker(middle, { title: text, icon: icon, pane: 'overlayPane' });

			// visible only starting at a specific zoom level
			var zoom = this._minimumZoomLevelForItem(i, showAll);
			if (zoomLayers[zoom] === undefined) {
				zoomLayers[zoom] = L.layerGroup();
			}
			zoomLayers[zoom].addLayer(marker);
		}

		var currentZoomLevel = 0;
		var markerLayer = this;
		var updateMarkerVisibility = function() {
			var oldZoom = currentZoomLevel;
			var newZoom = currentZoomLevel = map.getZoom();

			if (newZoom > oldZoom) {
				for (var i = oldZoom + 1; i <= newZoom; ++i) {
					if (zoomLayers[i] !== undefined) {
						markerLayer.addLayer(zoomLayers[i]);
					}
				}
			} else if (newZoom < oldZoom) {
				for (var i = oldZoom; i > newZoom; --i) {
					if (zoomLayers[i] !== undefined) {
						markerLayer.removeLayer(zoomLayers[i]);
					}
				}
			}
		};
		map.on('zoomend', updateMarkerVisibility);

		this._layers = {}; // need to initialize before adding markers to this LayerGroup
		updateMarkerVisibility();		
	},

	_minimumZoomLevelForItem: function (item, showAllLevel) {
		var zoom = showAllLevel;
		var i = item;
		while (i > 0 && i % 2 === 0) {
			--zoom;
			i = Math.floor(i / 2);
		}
		return zoom;
	},
});
 */

L.Polyline.include({
	_originalOnRemove1: L.Polyline.prototype.onRemove,
    _originalUpdatePath1: L.Polyline.prototype._updatePath,

	addBearingMarkers: function (options) {
		/* if (this._map) {
            if (this._bearingMarkers) this.removeBearingMarkers();
            this._bearingMarkers = new L.BearingMarkers(this, this._map, options);
			this._map.addLayer(this._bearingMarkers);
            this._nPoints = this._latlngs.length;
		} */
	},

	removeBearingMarkers: function () {
		/* if (this._map && this._bearingMarkers) {
			this._map.removeLayer(this._bearingMarkers);
            this._bearingMarkers = null;
		} */
	},
/* 
	onRemove: function (map) {
		this.removeBearingMarkers();
		this._originalOnRemove1(map);
	},

    _updatePath: function () {
        this._originalUpdatePath1();
        if (this._bearingMarkers && this._latlngs.length != this._nPoints) {
            this._parent.addBearingMarkers();
        }
    } */
});

 L.LayerGroup.include({
     addBearingMarkers: function(trace) {
		alert("addBearingMarkers")
		console.log(trace)
		//console.log(trace.getWaypoints())
		//console.log(trace.getPoints())
		console.log(trace.getSegments())
         /* for (var layer in this._layers) {
             if (typeof this._layers[layer].addBearingMarkers === 'function') {
                 this._layers[layer].addBearingMarkers(options);
                 this._layers[layer]._parent = this;
             }
         } */
         return this;
     },
     removeBearingMarkers: function() {
		alert("removeBearingMarkers")
         /* for (var layer in this._layers) {
             if (typeof this._layers[layer].removeBearingMarkers === 'function') {
                 this._layers[layer].removeBearingMarkers();
             }
         } */
         return this;
     }
 });
