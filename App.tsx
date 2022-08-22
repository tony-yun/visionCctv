import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Routes } from "./utils/Routes";
import { PermissionsPage } from "./components/PermissionsPage";
import { CameraPage } from "./components/CameraPage";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";

const Stack = createNativeStackNavigator<Routes>();

//원본에는 default가 없는데 여기서 에러가 난다. default 추가해서 해결.
export default function App(): React.ReactElement | null {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus>();

  //여기서는 getPermission, 나중에 권한 요청화면에서 requestPermission.
  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);
  console.log(
    "cameraPermission:",
    cameraPermission,
    "microphonePermission:",
    microphonePermission
  );

  if (cameraPermission == null || microphonePermission == null) {
    return null;
  }

  const showPermissionsPage =
    cameraPermission !== "authorized" ||
    microphonePermission === "not-determined";

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
        <Stack.Screen name="CameraPage" component={CameraPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
