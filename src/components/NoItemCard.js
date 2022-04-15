import React from "react";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";

const { width, height } = Dimensions.get("window");

export default function NoItemCard({ icon, msg }) {
  return (
    <View style={styles.noStarContainer}>
      <View style={{ width: width * 0.7, alignItems: "center" }}>
        <View style={styles.iconContainer}>
          {(icon === "heart" || "history") &&
          icon !== "star" &&
          icon !== "alarm-outline" ? (
            <FontAwesome5 name={icon} size={width * 0.16} color="white" />
          ) : (
            <>
              {icon === "alarm-outline" || "star" ? (
                <Ionicons name={icon} size={width * 0.16} color="white" />
              ) : null}
            </>
          )}
        </View>
        <Text style={styles.noStarText}>{msg}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noStarContainer: {
    flex: 0.95,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 160,
    height: 160,
    borderRadius: 160 / 2,
    backgroundColor: "#008069",
    marginBottom: "10%",
  },
  noStarText: {
    color: "grey",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});
