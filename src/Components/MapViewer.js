import React, { useRef, useEffect, useState } from "react";
import geojson2h3 from "geojson2h3";
import polygon from "../Utilities/Coordinates";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { token } from "../Utilities/Constant";
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
    const hexagons = geojson2h3.featureToH3Set(polygon, 8);
    const feature = geojson2h3.h3SetToFeature(hexagons);

    map.on("load", () => {
      map.addSource("maine", {
        type: "geojson",
        data: feature,
      });

      // Add a new layer to visualize the polygon.
      map.addLayer({
        id: "maine",
        type: "fill",
        source: "maine", // reference the data source
        layout: {},
        paint: {
          "fill-color": "#50BAC3",
          "fill-opacity": 0.5,
        },
      });
      // Add a black outline around the polygon.
      map.addLayer({
        id: "outline",
        type: "line",
        source: "maine",
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 3,
        },
      });

      map.on("click", "places", (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
      });
    });
  };

  return (
    <div
      style={{
        width: "85%",
        float: "left",
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
