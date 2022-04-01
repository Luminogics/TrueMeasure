import React, { useRef, useEffect, useState } from "react";
import geojson2h3 from "geojson2h3";
import polygon from "../Utilities/coordinates";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { token } from "../Utilities/constant";
import { layer } from "@fortawesome/fontawesome-svg-core";
import "./MapViewer.css"
mapboxgl.accessToken = token;

function MapViewer({ leftCord, rightCord }) {
  const mapContainer = useRef(null);
  let map = null;
  const [lng, setLng] = useState(-122.186688);
  const [lat, setLat] = useState(37.759638);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    leftCord && setLng(leftCord);
    rightCord && setLat(rightCord);

    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );
    let done;
    let count = 0;
    do {
      done = false;
      count += 1;
      try {
        map.loaded();
        done = true;
        initializeMap();
      } catch (error) {
        console.log("error");
      }
    } while (!done && count < 10);
  }, [lng, lat]);
  let setHexagons = () => {
    const layer = {};
    polygon.features.forEach((feature) => {
      const hexagons = geojson2h3.featureToH3Set(feature, 7);
      hexagons.forEach((h3Index) => {
        layer[h3Index] = feature.properties.travelTime;
      });
    });
    return normalizeLayer(layer);
  };
  function normalizeLayer(layer, zeroBaseline = false) {
    const hexagons = Object.keys(layer);
    // Pass one, get max (and min if needed)
    const max = hexagons.reduce(
      (max, hex) => Math.max(max, layer[hex]),
      -Infinity
    );
    const min = zeroBaseline
      ? 0
      : hexagons.reduce((min, hex) => Math.min(min, layer[hex]), Infinity);
    // Pass two, normalize
    hexagons.forEach((hex) => {
      layer[hex] = (layer[hex] - min) / (max - min);
    });
    return layer;
  }
  const initializeMap = async () => {
    let config = {
      lng: -122.2,
      lat: 37.7923539,
      zoom: 10.5,
      fillOpacity: 0.75,
      colorScale: ["#FF0000", "#008000", "#FFFF00", "#338c94"],
    };
    const hexagons = geojson2h3.featureToH3Set(polygon, 8);
    const feature = geojson2h3.h3SetToFeatureCollection(hexagons, (hex) => ({
      value: Number(Math.floor(Math.random() * 100)),
    }));
    console.log(feature);
    map.on("load", () => {
      const sourceId = "h3-hexes";
      const layerId = `${sourceId}-layer`;
      let source = map.getSource(sourceId);
      // Add the source and layer if we haven't created them yet
      if (!source) {
        map.addSource(sourceId, {
          type: "geojson",
          data: feature,
        });
        map.addLayer({
          id: layerId,
          source: sourceId,
          type: "fill",
          interactive: false,
          paint: {
            "fill-outline-color": "rgba(0,0,0,0)",
          },
        });
        source = map.getSource(sourceId);
      }
      // Add a new layer to visualize the polygon.
      map.addLayer({
        id: "outline",
        type: "fill",
        source: sourceId, // reference the data source
        type: "fill",
        interactive: false,
        paint: {
          "fill-outline-color": "rgba(0,0,0,0)",
          "fill-opacity": 0.5,
        },
      });
      // Update the geojson data
      source.setData(feature);
      // Add a black outline around the polygon.
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 5,
        },
      });
      // map.setPaintProperty(layerId, 'fill-color', '#feb24c')
      map.setPaintProperty(layerId, "fill-color", {
        property: "value",
        stops: [
          [0, config.colorScale[0]],
          [33, config.colorScale[1]],
          [66, config.colorScale[2]],
          [100, config.colorScale[3]],
        ],
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mouseenter", layerId, (e) => {

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties;


        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // popup.setLngLat([-122.1835470199585, 37.80724101305343]).setHTML(description.value).addTo(map);
      });
    });
  };

  return (
    <div
      style={{
        width: "85%",
        float: "left"
      }}
    >
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div
        ref={mapContainer}
        style={{
          height: "600px",
        }}
      />
    </div>
  );
}
export default MapViewer;
