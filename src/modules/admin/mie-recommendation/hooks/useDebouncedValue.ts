"use client";

import React from "react";

/**
 * Holds a value back until it stops changing. Used for the table search boxes so
 * a query only leaves for the server once the operator stops typing.
 */
export const useDebouncedValue = <T,>(value: T, delay = 400) => {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
