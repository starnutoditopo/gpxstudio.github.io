L.BearingMarkers = L.LayerGroup.extend({
	initialize: function (line, map, options, cumul) {
		options = options || {};
		var showAll = Math.min(map.getMaxZoom(), options.showAll || 13);
		var cssClass = options.cssClass || 'bearing-marker';
		var textFunction = options.textFunction || function(bearing, i) {
			return i;
		};

		var zoomLayers = {};
		// Get line coords as an array
		var coords = line;
		if (typeof line.getLatLngs == 'function') {
			coords = line.getLatLngs();
		}
		
		// Get accumulated line lengths as well as overall length
		var accumulated = L.GeometryUtil.accumulatedLengths(line);
		var length = accumulated.length > 0 ? accumulated[accumulated.length - 1] : 0;
		// Position in accumulated line length array
		//var j = 0;
		// Number of bearing markers to be added
		//var count = Math.floor(length / offset);

		alert(coords.length)
		for (var i = 1; i <= coords.length; ++i) {
			//var bearing = offset * i;
			
			var p1 = coords[i - 1];
			var p2 = coords[i];
			//var m_line = L.polyline([p1, p2]);
			//var ratio = (bearing - accumulated[j - 1]) / (accumulated[j] - accumulated[j - 1]);
			//var position = L.GeometryUtil.interpolateOnLine(map, m_line, ratio);
			var text = "aaa"; //textFunction.call(this, bearing, i, offset) + Math.round(cumul);
    		var iconSize = [4+6*text.toString().length,16];
			var icon = L.divIcon({ className: cssClass, html: text, iconSize: iconSize });
			var marker = L.marker(p1, { title: text, icon: icon, pane: 'overlayPane' });

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
        this._cumul = cumul + length / 1000;
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

L.Polyline.include({
	_originalOnRemove1: L.Polyline.prototype.onRemove,
    _originalUpdatePath1: L.Polyline.prototype._updatePath,

	addBearingMarkers: function (options, cumul) {
		if (this._map) {
            if (this._bearingMarkers) this.removeBearingMarkers();
            this._bearingMarkers = new L.BearingMarkers(this, this._map, options, cumul);
			this._map.addLayer(this._bearingMarkers);
            this._nPoints = this._latlngs.length;
            return this._bearingMarkers._cumul;
		}
        return 0;
	},

	removeBearingMarkers: function () {
		if (this._map && this._bearingMarkers) {
			this._map.removeLayer(this._bearingMarkers);
            this._bearingMarkers = null;
		}
	},

	onRemove: function (map) {
		this.removeBearingMarkers();
		this._originalOnRemove1(map);
	},

    _updatePath: function () {
        this._originalUpdatePath1();
        if (this._bearingMarkers && this._latlngs.length != this._nPoints) {
            this._parent.addBearingMarkers();
        }
    }
});

L.LayerGroup.include({
    addBearingMarkers: function(options) {
		//alert("Add")
        var cumul = 0;
        for (var layer in this._layers) {
            if (typeof this._layers[layer].addBearingMarkers === 'function') {
                cumul = this._layers[layer].addBearingMarkers(options, cumul);
                this._layers[layer]._parent = this;
            }
        }
        return this;
    },
    removeBearingMarkers: function() {
		//alert("Remove")
        for (var layer in this._layers) {
            if (typeof this._layers[layer].removeBearingMarkers === 'function') {
                this._layers[layer].removeBearingMarkers();
            }
        }
        return this;
    }
});
