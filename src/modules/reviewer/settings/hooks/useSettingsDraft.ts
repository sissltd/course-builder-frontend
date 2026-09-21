"use client";

import React from "react";


export function useSettingsDraft<T extends object>(server: T) {
  const [draft, setDraft] = React.useState<T>(server);

  const setField = React.useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

 
  const changedKeys = React.useMemo(
    () =>
      (Object.keys(draft) as Array<keyof T>).filter(
        (key) => draft[key] !== server[key],
      ),
    [draft, server],
  );

  const reset = React.useCallback(() => setDraft(server), [server]);

  return { draft, setField, changedKeys, isDirty: changedKeys.length > 0, reset };
}
