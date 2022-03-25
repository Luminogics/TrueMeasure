import React, { useRef, useEffect, useState } from 'react';
import geojson2h3 from 'geojson2h3';
import polygon from '../coordinates';
import {h3ToGeo} from "h3-js";

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoibW91emFtMDA3IiwiYSI6ImNsMTR3MGZmejAwODQzaXMxcWdqMTMwOHcifQ.0zIQv2P6soKa7k178Y6neg';

function RightNav() {
  const mapContainer = useRef(null);
  let map = null;
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      //center: [lng, lat],
      center: [-122.186688,
        37.759638],
      zoom: zoom,
      illOpacity: 0.75,
      colorScale: Array(3) ["#ffffD9", "#50BAC3", "#1A468A"]
    });
    let done;
    let count = 0;

    do {
      console.log("WORKING")
      done = false;
      count += 1;
      try {
        map.loaded()
        done = true;
        initializeMap();

      } catch (error) {
        console.log('error')
      }
    } while (!done && count < 10)

  }, [])



  let hexagons1 = () => {
    const layer = {};
    polygon.features.forEach(feature => {
      const hexagons = geojson2h3.featureToH3Set(feature, 7);
      hexagons.forEach(h3Index => {
        layer[h3Index] = feature.properties.travelTime;
      })
    });
    return normalizeLayer(layer);
  }


  function normalizeLayer(layer, zeroBaseline = false) {
    console.log('normalizeLayer', layer)
    const hexagons = Object.keys(layer);
    // Pass one, get max (and min if needed)
    const max = hexagons.reduce((max, hex) => Math.max(max, layer[hex]), -Infinity);
    const min = zeroBaseline ? 0 :
      hexagons.reduce((min, hex) => Math.min(min, layer[hex]), Infinity);
    // Pass two, normalize
    hexagons.forEach(hex => {
      layer[hex] = (layer[hex] - min) / (max - min);
    });
    return layer;
  }

  const initializeMap = async () => {



    const hexagons = geojson2h3.featureToH3Set(polygon, 8);
    const feature = geojson2h3.h3SetToFeature(hexagons);


    console.log(feature)
    console.log("INITIALIZE")
    map.on('load', () => {
      map.addSource('maine', {
        'type': 'geojson',
        'data': feature
      })

      // })
      //     // Add a new layer to visualize the polygon.
      map.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'maine', // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#50BAC3', // blue color fill
          'fill-opacity': 0.5
        }
      });
      //     // Add a black outline around the polygon.
      map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'maine',
        'layout': {},
        'paint': {
          'line-color': '#000',
          'line-width': 3
        }
      });

      
      map.on('click', 'places', (e) => {
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
        
      
      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      console.log("POPUP", popup)


      map.on('mouseenter', 'maine', (e) => {
        console.log("Event", e)
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.DISPLAY_NAME;

        // while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //   coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }

        console.log("COORDINATES", coordinates)
        popup.setLngLat(coordinates).setHTML(description).addTo(map);

      })
    })

  }



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
      <div ref={mapContainer} style={{
        height: '600px'
      }} />
    </div>
  );
}

export default RightNav;
