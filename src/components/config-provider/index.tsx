import { type PropsWithChildren, createContext, createElement } from 'react';
import type { SpaceSizeType } from '../space';

export interface ConfigContextType {
  space?: {
    size?: SpaceSizeType;
  };
}

export const ConfigContext = createContext<ConfigContextType>({});

export function ConfigProvider({
  children,
  value,
}: PropsWithChildren<{ value: ConfigContextType }>) {
  return createElement(ConfigContext.Provider, { value }, children);
}
