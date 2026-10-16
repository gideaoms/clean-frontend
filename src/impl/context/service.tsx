import { createContext, type ReactNode, useContext } from 'react';
import type { StorageService } from '../../core/service/storage.ts';
import { StorageServiceImpl } from '../service/storage.ts';

type Services = {
  storage: StorageService;
};

const Context = createContext<Services | null>(null);
const storage = new StorageServiceImpl();

export function ServiceProvider(props: { children: ReactNode }) {
  return <Context value={{ storage }}>{props.children}</Context>;
}

export function useProvider() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Provider Context must be provided');
  }
  return context;
}
