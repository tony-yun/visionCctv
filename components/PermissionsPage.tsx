import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { StyleSheet, Text, View } from "react-native";
import type { Routes } from "../utils/Routes";

type Props = NativeStackScreenProps<Routes, "PermissionsPage">;
export function PermissionsPage({ navigation }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text>PermissionsPage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
