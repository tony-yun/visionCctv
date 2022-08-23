import React, { useCallback, useEffect, useRef, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import type { Routes } from "../utils/Routes";
import {
  Camera,
  CameraRuntimeError,
  useCameraDevices,
  VideoFile,
} from "react-native-vision-camera";
import {
  useSharedValue,
  useAnimatedProps,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/core";
import { useIsForeground } from "../utils/useIsForeground";
import { MAX_ZOOM_FACTOR } from "../utils/Constants";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from "react-native-gesture-handler";

type Props = NativeStackScreenProps<Routes, "CameraPage">;
export function CameraPage({ navigation }: Props): React.ReactElement {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const zoom = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  //cameraPage가 active인지 확인.
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  //useState, Flip-position, flash
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const [flash, setFlash] = useState<"off" | "on">("off");

  //basic camera format setup
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  //Animated zoom, this maps the zoom to a percentage value
  //e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  //maxZoon 이 원본에는 Math.min이지만 여기서는 Math.max로 변경.
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.max(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);
  //여기서는 Math.min을 사용하는게 맞는지.
  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  // Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );
  const onError = useCallback((error: CameraRuntimeError) => {
    console.log(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log("Camera initialized");
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = useCallback((media: VideoFile, type: "video") => {
    console.log(`Media captured ${JSON.stringify(media)}`);
  }, []);
  // * path: media.path, type:type.
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === "back" ? "front" : "back"));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === "off" ? "on" : "off"));
  }, []);
  // Callbacks end

  //Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  //Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes.
    //(reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  useEffect(() => {
    Camera.getMicrophonePermissionStatus().then((status) =>
      setHasMicrophonePermission(status === "authorized")
    );
  }, []);

  //Pinch to Zoom Gesture
  // 제스처 핸들러는 카메라의 줌 이후 선형 핀치 제스처(0 - 1)를 지수 곡선에 매핑한다.
  // 함수가 사용자에게 선형으로 표시되지 않습니다. (aka zoom 0.1 -> 0.2는 0.8 -> 0.9로 차이가 같아 보이지 않는다.)
  // * yarn add react-native-gesture-handler로 했지만 expo install을 해야했는지 의문.

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
