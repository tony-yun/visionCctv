import { Dimensions, Platform } from "react-native";
import StaticSafeAreaInsets from "react-native-static-safe-area-insets";

const SAFE_BOTTOM =
  Platform.select({
    ios: StaticSafeAreaInsets.safeAreaInsetsBottom,
  }) ?? 0;

export const CONTENT_SPACING = 15;

export const SAFE_AREA_PADDING = {
  paddingLeft: StaticSafeAreaInsets.safeAreaInsetsLeft + CONTENT_SPACING,
  paddingTop: StaticSafeAreaInsets.safeAreaInsetsTop + CONTENT_SPACING,
  paddingRight: StaticSafeAreaInsets.safeAreaInsetsRight + CONTENT_SPACING,
  paddingBottom: SAFE_BOTTOM + CONTENT_SPACING,
};

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get("screen").height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get("window").height,
}) as number;

// The maximum zoom _factor_ you should be able to zoom in
// 원본은 20이지만, 여기서는 30까지 늘려봄.
export const MAX_ZOOM_FACTOR = 30;
// 스케일 풀 줌 원본 3
export const SCALE_FULL_ZOOM = 3;
//버튼 사이즈 원본 40
export const BUTTON_SIZE = 40;
// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;
export const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

export const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
export const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

export const START_RECORDING_DELAY = 200;

export const FALLBACK_COLOR = "rgba(140, 140, 140, 0.3)";
