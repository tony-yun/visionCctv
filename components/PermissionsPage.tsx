import React, { useCallback, useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Image,
  ImageRequireSource,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Routes } from "../utils/Routes";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import { CONTENT_SPACING, SAFE_AREA_PADDING } from "../utils/Constants";

const BANNER_IMAGE =
  require("../assets/waterai_rmbg.png") as ImageRequireSource;

type Props = NativeStackScreenProps<Routes, "PermissionsPage">;
export function PermissionsPage({ navigation }: Props): React.ReactElement {
  /**
   * useState로 카메라 권한, 마이크 권한 선언.
   */
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");
  /**
   * useCallback 을 사용하여 카메라 권한 요청을 처리하는 함수를 선언.
   */
  const requestCameraPermission = useCallback(async () => {
    console.log("requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log("reqCameraPermission:", permission);
    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);
  /**
   * useCallback 을 사용하여 마이크 권한 요청을 처리하는 함수를 선언.
   */
  const reqestMicrophonePermission = useCallback(async () => {
    console.log("requesting microphone permission...");
    const permission = await Camera.requestMicrophonePermission();
    console.log("reqMicrophonePermission:", permission);
    if (permission === "denied") await Linking.openSettings();
    // Linking.openSettings(): 설정 앱을 열고 앱의 사용자 지정 설정이 있는 경우 이를 표시한다.
    setMicrophonePermissionStatus(permission);
  }, []);

  /**
   * useEffect로 카메라, 마이크 권한 승인 시 카메라 페이지로 이동.
   */
  useEffect(() => {
    if (
      cameraPermissionStatus === "authorized" &&
      microphonePermissionStatus === "authorized"
    )
      navigation.replace("CameraPage");
  }, [cameraPermissionStatus, microphonePermissionStatus, navigation]);
  //navigation.replace("CameraPage"): Stack 쌓지 않고 CameraPage로 이동하기.

  return (
    <View style={styles.container}>
      <Image source={BANNER_IMAGE} style={styles.banner} />
      <Text style={styles.welcome}>WateraiCctv{"\n"}권한 설정</Text>
      <View style={styles.permissionsContainer}>
        {/* 카메라 권한 요청 */}
        {cameraPermissionStatus !== "authorized" && (
          <Text style={styles.permissionText}>
            WateraiCctv는{" "}
            <Text style={styles.bold}>카메라 권한이 필요합니다</Text>.{" "}
            <Text style={styles.hyperlink} onPress={requestCameraPermission}>
              승인하기
            </Text>
          </Text>
        )}
        <Text> </Text>
        {/* 마이크 권한 요청 */}
        {microphonePermissionStatus !== "authorized" && (
          <Text style={styles.permissionText}>
            WateraiCctv는{" "}
            <Text style={styles.bold}>마이크 권한이 필요합니다</Text>.{" "}
            <Text style={styles.hyperlink} onPress={reqestMicrophonePermission}>
              승인하기
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    ...SAFE_AREA_PADDING,
  },
  banner: {
    position: "absolute",
    opacity: 0.4,
    bottom: 0,
    right: 0,
  },
  welcome: {
    fontSize: 38,
    fontWeight: "bold",
    maxWidth: "80%",
  },
  permissionsContainer: {
    marginTop: CONTENT_SPACING * 2,
  },
  permissionText: {
    fontSize: 17,
  },
  hyperlink: {
    color: "#007aff",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
});
