import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { Routes } from "./utils/Routes";
import { PermissionsPage } from "./components/PermissionsPage";
import { CameraPage } from "./components/CameraPage";

const Stack = createNativeStackNavigator<Routes>();

export default function App(): React.ReactElement | null {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
        <Stack.Screen name="CameraPage" component={CameraPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
