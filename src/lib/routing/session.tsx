import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../../types';
import { findRouteByTab, getDefaultTab, isTabAllowed, resolveInitialTab } from './routes';

export type SessionStatus = 'loading' | 'anonymous' | 'authenticated';

export interface SocketPort {
  reconnect(): void;
  close(): void;
}

export interface StoragePort {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface SessionSnapshot {
  user: User | null;
  status: SessionStatus;
  activeTab: string;
}

export const USER_STORAGE_KEY = 'zmc_user';
export const TOKEN_STORAGE_KEY = 'zmc_token';
export const LOGOUT_EVENT_NAME = 'zmc-logout';

export function memoryStorage(): StoragePort {
  const map = new Map<string, string>();
  return {
    get: (key) => (map.has(key) ? (map.get(key) as string) : null),
    set: (key, value) => {
      map.set(key, value);
    },
    remove: (key) => {
      map.delete(key);
    },
  };
}

function browserStorage(): StoragePort | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return {
      get: (key) => localStorage.getItem(key),
      set: (key, value) => localStorage.setItem(key, value),
      remove: (key) => localStorage.removeItem(key),
    };
  } catch {
    return null;
  }
}

function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const raw =
      typeof atob !== 'undefined'
        ? atob(base64)
        : (globalThis as { Buffer?: { from(s: string, e: string): { toString(e: string): string } } })
            .Buffer?.from(base64, 'base64')
            .toString('utf8') ?? '';
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isTokenExpiredValue(token: string): boolean {
  const payload = decodePayload(token);
  if (!payload) return true;
  if (typeof payload.exp !== 'number') return false;
  return payload.exp < Math.floor(Date.now() / 1000);
}

function isUserShape(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.username === 'string' &&
    typeof candidate.role === 'string' &&
    typeof candidate.department === 'string'
  );
}

export function readStoredSession(storage: StoragePort): {
  user: User | null;
  token: string | null;
} {
  const rawUser = storage.get(USER_STORAGE_KEY);
  const token = storage.get(TOKEN_STORAGE_KEY);
  if (!rawUser || !token || isTokenExpiredValue(token)) {
    if (rawUser || token) {
      storage.remove(USER_STORAGE_KEY);
      storage.remove(TOKEN_STORAGE_KEY);
    }
    return { user: null, token: null };
  }
  try {
    const parsed: unknown = JSON.parse(rawUser);
    if (!isUserShape(parsed)) {
      storage.remove(USER_STORAGE_KEY);
      storage.remove(TOKEN_STORAGE_KEY);
      return { user: null, token: null };
    }
    return { user: parsed, token };
  } catch {
    storage.remove(USER_STORAGE_KEY);
    storage.remove(TOKEN_STORAGE_KEY);
    return { user: null, token: null };
  }
}

function pushPath(path: string): void {
  try {
    if (typeof window === 'undefined' || !window.history) return;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  } catch {
    return;
  }
}

function currentPathname(fallback: string): string {
  try {
    if (typeof window === 'undefined') return fallback;
    return window.location.pathname || fallback;
  } catch {
    return fallback;
  }
}

export interface SessionControllerOptions {
  storage?: StoragePort;
  socket?: SocketPort;
  initialPath?: string;
}

export interface SessionController {
  getSnapshot(): SessionSnapshot;
  subscribe(listener: () => void): () => void;
  navigate(tab: string): void;
  login(user: User, token: string): boolean;
  logout(): void;
}

export function createSessionController(options: SessionControllerOptions = {}): SessionController {
  const storage = options.storage ?? browserStorage() ?? memoryStorage();
  const socket = options.socket ?? null;
  const { user: storedUser } = readStoredSession(storage);
  const initialPath = options.initialPath ?? currentPathname('/');
  let snapshot: SessionSnapshot = {
    user: storedUser,
    status: storedUser ? 'authenticated' : 'anonymous',
    activeTab: resolveInitialTab(initialPath, storedUser),
  };
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const setSnapshot = (next: SessionSnapshot) => {
    snapshot = next;
    emit();
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    navigate: (tab: string) => {
      const { user } = snapshot;
      const nextTab = user && !isTabAllowed(user, tab) ? getDefaultTab(user) : tab;
      setSnapshot({ ...snapshot, activeTab: nextTab });
      const canonicalPath = findRouteByTab(nextTab)?.path;
      if (canonicalPath) {
        pushPath(canonicalPath);
      }
    },
    login: (user: User, token: string) => {
      if (!token || isTokenExpiredValue(token) || !isUserShape(user)) {
        return false;
      }
      storage.set(TOKEN_STORAGE_KEY, token);
      storage.set(USER_STORAGE_KEY, JSON.stringify(user));
      const defaultTab = getDefaultTab(user);
      setSnapshot({ user, status: 'authenticated', activeTab: defaultTab });
      const defaultPath = findRouteByTab(defaultTab)?.path;
      if (defaultPath) {
        pushPath(defaultPath);
      }
      try {
        socket?.reconnect();
      } catch {
        return true;
      }
      return true;
    },
    logout: () => {
      storage.remove(USER_STORAGE_KEY);
      storage.remove(TOKEN_STORAGE_KEY);
      setSnapshot({ user: null, status: 'anonymous', activeTab: 'dashboard' });
      pushPath('/');
      try {
        socket?.close();
      } catch {
        return;
      }
    },
  };
}

export interface SessionValue extends SessionSnapshot {
  navigate: (tab: string) => void;
  login: (user: User, token: string) => boolean;
  logout: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export interface SessionProviderProps {
  children: ReactNode;
  storage?: StoragePort;
  socket?: SocketPort;
  initialPath?: string;
}

export function SessionProvider(props: SessionProviderProps): ReactNode {
  const controller = useMemo(
    () =>
      createSessionController({
        storage: props.storage,
        socket: props.socket,
        initialPath: props.initialPath,
      }),
    // Created once per mount; ports are construction-time dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [snapshot, setSnapshot] = useState<SessionSnapshot>(() => controller.getSnapshot());

  useEffect(() => controller.subscribe(() => setSnapshot(controller.getSnapshot())), [controller]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleLogoutEvent = () => controller.logout();
    const handlePopState = () => {
      const current = controller.getSnapshot();
      const tab = resolveInitialTab(window.location.pathname, current.user);
      if (tab !== current.activeTab) {
        controller.navigate(tab);
      }
    };
    window.addEventListener(LOGOUT_EVENT_NAME, handleLogoutEvent);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener(LOGOUT_EVENT_NAME, handleLogoutEvent);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [controller]);

  const value = useMemo<SessionValue>(
    () => ({
      user: snapshot.user,
      status: snapshot.status,
      activeTab: snapshot.activeTab,
      navigate: (tab: string) => controller.navigate(tab),
      login: (user: User, token: string) => controller.login(user, token),
      logout: () => controller.logout(),
    }),
    [controller, snapshot],
  );

  return <SessionContext.Provider value={value}>{props.children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession must be used inside SessionProvider');
  }
  return value;
}
