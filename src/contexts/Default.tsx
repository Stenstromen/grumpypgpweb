/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState } from "react";
import { Key } from "../Types";

export const DefaultContext = createContext({
  keysArray: [] as Key[],
  setKeysArray: (_keysArray: Key[]) => {},
});

import { ReactNode } from "react";

export function DefaultProvider({ children }: { children: ReactNode }) {
  const [keysArray, setKeysArray] = useState<Key[]>([]);

  return (
    <DefaultContext.Provider value={{ keysArray, setKeysArray }}>
      {children}
    </DefaultContext.Provider>
  );
}

export function useDefaultProvider() {
  const context = useContext(DefaultContext);

  if (!context) {
    throw new Error("useDefaultProvider is outside of defaultProvider");
  }

  return context;
}
