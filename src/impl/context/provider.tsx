import { createContext, useContext, type ReactNode } from 'react';
import type { StorageProvider } from '../../core/provider/storage.ts';
import { StorageProviderImpl } from '../provider/storage.ts';

type Providers = {
  storage: StorageProvider
}

const Context = createContext<Providers | null>(null);
const storage = new StorageProviderImpl();

export function ProviderProvider(props: { children: ReactNode }) {
  return (
    <Context.Provider value={{ storage }}>
      {props.children}
    </Context.Provider>
  );
}

export function useProvider() {
  const provider = useContext(Context);
  if (!provider) {
    throw new Error('Provider Context must be provided');
  }
  return provider;
}
