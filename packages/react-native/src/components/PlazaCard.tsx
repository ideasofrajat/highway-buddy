import type { TollPlazaWithCost } from "@highway-buddy/core";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type PlazaCardProps = {
  plaza: TollPlazaWithCost;
};

export const PlazaCard = ({ plaza }: PlazaCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{plaza.name}</Text>
    <Text style={styles.meta}>
      {plaza.nh} • {plaza.state}
    </Text>
    <Text style={styles.meta}>Operator: {plaza.operator}</Text>
    <Text style={styles.price}>FASTag: Rs {plaza.fastagRate}</Text>
    <Text style={styles.price}>Cash: Rs {plaza.cashRate}</Text>
    <Text style={styles.total}>Applied: Rs {plaza.appliedRate}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    marginVertical: 8
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  meta: { marginTop: 4, fontSize: 13, color: "#374151" },
  price: { marginTop: 6, fontSize: 14, color: "#1f2937" },
  total: { marginTop: 8, fontSize: 15, fontWeight: "700", color: "#0f766e" }
});
