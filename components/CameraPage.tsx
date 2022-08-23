import React, { useRef, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import type { Routes } from "../utils/Routes";
import { Camera } from "react-native-vision-camera";
import { useSharedValue } from "react-native-reanimated";

type Props = NativeStackScreenProps<Routes, "CameraPage">;
export function CameraPage({ navigation }: Props): React.ReactElement {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  return (
    <View style={styles.container}>
      <Text>CameraPage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
