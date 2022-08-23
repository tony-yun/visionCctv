import { useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * AppState can tell you if the app is in the foreground or background,
 * and notify you when the state changes.
 * @returns {boolean} true if the app is in the foreground
 */

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === "active");
    };
    const listener = AppState.addEventListener("change", onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return isForeground;
};
