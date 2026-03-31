import type { TollPlazaWithCost } from "@highway-buddy/core";
import React from "react";
import MapView, { Marker, Polyline } from "react-native-maps";

type RouteMapProps = {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  plazas: TollPlazaWithCost[];
};

export const RouteMap = ({ origin, destination, plazas }: RouteMapProps) => (
  <MapView
    style={{ height: 280, width: "100%" }}
    initialRegion={{
      latitude: origin.lat,
      longitude: origin.lng,
      latitudeDelta: 8,
      longitudeDelta: 8
    }}
  >
    <Marker coordinate={{ latitude: origin.lat, longitude: origin.lng }} title="Origin" />
    <Marker
      coordinate={{ latitude: destination.lat, longitude: destination.lng }}
      title="Destination"
    />
    {plazas.map((plaza) => (
      <Marker
        key={plaza.id}
        coordinate={{ latitude: plaza.coordinates.lat, longitude: plaza.coordinates.lng }}
        title={plaza.name}
        description={`${plaza.nh} • Rs ${plaza.appliedRate}`}
      />
    ))}
    <Polyline
      coordinates={[
        { latitude: origin.lat, longitude: origin.lng },
        ...plazas.map((p) => ({ latitude: p.coordinates.lat, longitude: p.coordinates.lng })),
        { latitude: destination.lat, longitude: destination.lng }
      ]}
      strokeWidth={3}
      strokeColor="#2563eb"
    />
  </MapView>
);
