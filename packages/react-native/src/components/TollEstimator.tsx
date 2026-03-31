import { HighwayBuddy, VehicleClass } from "@highway-buddy/core";
import React, { useState } from "react";
import { Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";

type CoordinateInput = { lat: string; lng: string };

const sdk = new HighwayBuddy();

export const TollEstimator = () => {
  const [origin, setOrigin] = useState<CoordinateInput>({ lat: "28.6139", lng: "77.2090" });
  const [destination, setDestination] = useState<CoordinateInput>({
    lat: "19.0760",
    lng: "72.8777"
  });
  const [fastagEnabled, setFastagEnabled] = useState(true);
  const [result, setResult] = useState<null | { totalToll: number; plazas: number }>(null);
  const [error, setError] = useState<string | null>(null);

  const onEstimate = async () => {
    try {
      setError(null);
      const data = await sdk.calculateTolls({
        origin: { lat: Number(origin.lat), lng: Number(origin.lng) },
        destination: { lat: Number(destination.lat), lng: Number(destination.lng) },
        vehicleClass: VehicleClass.CAR_JEEP_VAN,
        fastagEnabled
      });
      setResult({ totalToll: data.totalToll, plazas: data.plazas.length });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to estimate toll.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Toll Estimator</Text>
      <TextInput
        style={styles.input}
        value={origin.lat}
        onChangeText={(lat) => setOrigin((prev) => ({ ...prev, lat }))}
        placeholder="Origin lat"
      />
      <TextInput
        style={styles.input}
        value={origin.lng}
        onChangeText={(lng) => setOrigin((prev) => ({ ...prev, lng }))}
        placeholder="Origin lng"
      />
      <TextInput
        style={styles.input}
        value={destination.lat}
        onChangeText={(lat) => setDestination((prev) => ({ ...prev, lat }))}
        placeholder="Destination lat"
      />
      <TextInput
        style={styles.input}
        value={destination.lng}
        onChangeText={(lng) => setDestination((prev) => ({ ...prev, lng }))}
        placeholder="Destination lng"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>FASTag enabled</Text>
        <Switch value={fastagEnabled} onValueChange={setFastagEnabled} />
      </View>

      <Button title="Estimate" onPress={onEstimate} />

      {result ? (
        <View style={styles.result}>
          <Text style={styles.resultText}>Total Toll: Rs {result.totalToll}</Text>
          <Text style={styles.resultText}>Plazas: {result.plazas}</Text>
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 14,
    borderColor: "#d1d5db",
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#111827" },
  input: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  label: { fontSize: 14, color: "#374151" },
  result: { marginTop: 12 },
  resultText: { fontSize: 15, color: "#065f46", fontWeight: "600", marginTop: 4 },
  error: { marginTop: 10, color: "#b91c1c" }
});
