import React, { useCallback, useRef } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Reanimated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  useSharedValue,
  withRepeat,
} from "react-native-reanimated";
import type {
  Camera,
  PhotoFile,
  TakePhotoOptions,
  TakeSnapshotOptions,
  VideoFile,
} from "react-native-vision-camera";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import { CAPTURE_BUTTON_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from "./Constants";

const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

const START_RECORDING_DELAY = 200;
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  onMediaCaptured: (media: VideoFile, type: "video") => void;
  minZoom: number;
  maxZoom: number;
  cameraZoom: Reanimated.SharedValue<number>;

  flash: "off" | "on";
  enabled: boolean;
  setIsPressingButton: (isPressingButton: boolean) => void;
}

const _CaptureButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  minZoom,
  maxZoom,
  cameraZoom,
  flash,
  enabled,
  setIsPressingButton,
  style,
  ...props
}): React.ReactElement => {
  const pressDownDate = useRef<Date | undefined>(undefined);
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
    console.log("stopped recording video activated.");
  }, [recordingProgress]);

  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null");
      await camera.current.stopRecording();
    } catch (e) {
      console.log("stopRecording error:", e);
    }
  }, [camera]);

  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error("Camera res is null");
      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error) => {
          console.log("Recording error:", error);
          onStoppedRecording();
        },
        onRecordingFinished: (video) => {
          console.log(`Video path: ${video.path}`);
          onMediaCaptured(video, "video");
          onStoppedRecording();
        },
      });
      console.log("startRecording activated.");
      isRecording.current = true;
    } catch (e) {
      console.log("startRecording error:", e);
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);

  //gesture handler
  const tapHandler = useRef<TapGestureHandler>();
  const onHandlerStateChanged = useCallback(
    async ({ nativeEvent: event }: TapGestureHandlerStateChangeEvent) => {
      console.debug(`state:${Object.keys(State)[event.state]}`);
      switch (event.state) {
        case State.BEGAN: {
          recordingProgress.value = 0;
          isPressingButton.value = true;
          const now = new Date();
          pressDownDate.current = now;
          setTimeout(() => {
            if (pressDownDate.current === now) {
              startRecording();
            }
          }, START_RECORDING_DELAY);
          setIsPressingButton(true);
          return;
        }
        case State.END:
        case State.FAILED:
        case State.CANCELLED: {
          try {
            if (pressDownDate.current == null)
              throw new Error("PressDownDate ref.current is null");
            const now = new Date();
            const diff = now.getTime() - pressDownDate.current.getTime();
            pressDownDate.current = undefined;
            if (diff < START_RECORDING_DELAY) {
              null;
              //START_RECORDING_DELAY=200 ms
            } else {
              await stopRecording();
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false;
              setIsPressingButton(false);
            }, 500);
          }
          return;
        }
        default:
          break;
      }
    },
    [
      isPressingButton,
      recordingProgress,
      setIsPressingButton,
      startRecording,
      stopRecording,
    ]
  );

  //????????? ????????? ?????????
  const panHandler = useRef<PanGestureHandler>();
  const onPanGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetY?: number; startY?: number }
  >({
    onStart: (event, context) => {
      context.startY = event.absoluteY;
      const yForFullZoom = context.startY * 0.7;
      const offsetYForFullZoom = context.startY - yForFullZoom;
      // extrapolate [0 ... 1] zoom -> [0 ... Y_FOR_FULL_ZOOM] finger position
      context.offsetY = interpolate(
        cameraZoom.value,
        [minZoom, maxZoom],
        [0, offsetYForFullZoom],
        Extrapolate.CLAMP
      );
    },
    onActive: (event, context) => {
      const offset = context.offsetY ?? 0;
      const startY = context.startY ?? SCREEN_HEIGHT;
      const yForFullZoom = startY * 0.7;

      cameraZoom.value = interpolate(
        event.absoluteY - offset,
        [yForFullZoom, startY],
        [maxZoom, minZoom],
        Extrapolate.CLAMP
      );
    },
  });

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton]
  );

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number;
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true
        );
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        });
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      });
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      transform: [
        {
          scale: scale,
        },
      ],
    };
  }, [enabled, isPressingButton]);

  return (
    <TapGestureHandler
      enabled={enabled}
      ref={tapHandler}
      onHandlerStateChange={onHandlerStateChanged}
      shouldCancelWhenOutside={false}
      maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to
      //State.FAILED when the user moves his finger outside of the child view (to zoom)
      simultaneousHandlers={panHandler} // simultaneous????????? ???????????? Handlers
    >
      <Reanimated.View {...props} style={[buttonStyle, style]}>
        <PanGestureHandler
          enabled={enabled}
          ref={panHandler}
          failOffsetX={PAN_GESTURE_HANDLER_FAIL_X}
          activeOffsetY={PAN_GESTURE_HANDLER_ACTIVE_Y}
          onGestureEvent={onPanGestureEvent}
          simultaneousHandlers={tapHandler} // simultaneous????????? ???????????? Handlers
        >
          <Reanimated.View style={styles.flex}>
            <Reanimated.View style={[styles.shadow, shadowStyle]} />
            <View style={styles.button} />
          </Reanimated.View>
        </PanGestureHandler>
      </Reanimated.View>
    </TapGestureHandler>
  );
};

export const CaptureButton = React.memo(_CaptureButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  shadow: {
    position: "absolute",
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: "#e34077",
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: "bisque",
  },
});
