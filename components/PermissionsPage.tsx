import React, { useCallback, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ImageRequireSource,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Routes } from "../utils/Routes";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";

const BANNER_IMAGE =
  require("../assets/waterai_rmbg.png") as ImageRequireSource;

type Props = NativeStackScreenProps<Routes, "PermissionsPage">;
export function PermissionsPage({ navigation }: Props): React.ReactElement {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const requestCameraPermission = useCallback(async () => {
    console.log("requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log("camera permission:", permission);
    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  const reqestMicrophonePermission = useCallback(async () => {
    console.log("requesting microphone permission...");
    const permission = await Camera.requestMicrophonePermission();
    console.log("microphone permission:", permission);
    if (permission === "denied") await Linking.openSettings();
    // Linking.openSettings(): 설정 앱을 열고 앱의 사용자 지정 설정이 있는 경우 이를 표시한다.
    setMicrophonePermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (
      cameraPermissionStatus === "authorized" &&
      microphonePermissionStatus === "authorized"
    )
      navigation.replace("CameraPage");
  }, [cameraPermissionStatus, microphonePermissionStatus, navigation]);
  //navigation.replace("CameraPage") Stack 쌓지 않고 CameraPage로 이동하기.

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
