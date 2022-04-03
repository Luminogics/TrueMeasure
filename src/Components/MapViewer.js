import React, { useRef, useEffect, useState } from "react";
import geojson2h3 from "geojson2h3";
import { polygonTwo, polygonOne, polygonThree } from "../Utilities/coordinates";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { token } from "../Utilities/constant";
import { layer } from "@fortawesome/fontawesome-svg-core";
import "./MapViewer.css";
import "mapbox-gl/dist/mapbox-gl.css";

//https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"

mapboxgl.accessToken = token;

function MapViewer({ leftCord, rightCord, value }) {
  const mapContainer = useRef(null);
 
  let map = null;
  const [lng, setLng] = useState(-122.304026);
  const [lat, setLat] = useState(37.807388);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (value=== 10) {
      setLng(-122.304026);
      setLat(37.807388);
    } else {
      setLng(-121.353637);
      setLat(40.584978);
    }
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

        // see https://docs.mapbox.com/api/search/#geocoding-response-object for information about the schema of each response feature
        render: function (item) {
          const maki = item.properties.maki || "marker";
          return `<div class='geocoder-dropdown-item'>
              <span class='geocoder-dropdown-text'>
                ${item.text}
              </span> 
            </div>`;
        },
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
  }, [lng, lat, value]);


  const initializeMap = async () => {
    let config = {
      lng: -122.2,
      lat: 37.7923539,
      zoom: 10.5,
      fillOpacity: 0.75,
      colorScale: ["#FF0000", "#008000", "#FFFF00", "#338c94"],
    };
    let shape;
    value === 10 ? (shape = polygonThree) : (shape = polygonOne);
    const hexagons = geojson2h3.featureToH3Set(shape, 8);
    const feature = geojson2h3.h3SetToFeatureCollection(hexagons, (hex) => ({
      value: Number(Math.floor(Math.random() * 100)),
    }));
    

    map.on("load", () => {
      const sourceId = `${value}-h3-hexes`;
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

      // map.removeLayer(`${value}-h3-hexes-layer`);

      // map.removeLayer(`outline`);
      // //
      // map.removeSource(`${value}-h3-hexes`)
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

        //-122.304026,
        //37.807388

        //popup.setLngLat(coordinates).setHTML(description.value).addTo(map);
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
      <div className="geocoder"></div>
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
