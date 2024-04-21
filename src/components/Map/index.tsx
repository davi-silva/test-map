"use client";

import { useEffect, useRef, useState } from "react";

import type { Marker } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import trees from "./data";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
const MAP_ID = process.env.MAP_ID as string;

const App = () => {
  console.log({ API_KEY, MAP_ID });
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        mapId={MAP_ID}
        defaultCenter={{ lat: 43.64, lng: -79.41 }}
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        <Markers points={trees} />
      </Map>
    </APIProvider>
  );
};

type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  // console.log({ map, markers, clusterer });

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
      });
    }
    // console.log("updating clusters...");
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
    // clusterer.current?.mar
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  console.log({ markers });

  return (
    <div>
      {points.map((point) => (
        <AdvancedMarker
          position={point}
          key={point.key}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <span className="tree">🌳</span>
        </AdvancedMarker>
      ))}
    </div>
  );
};

export default App;
