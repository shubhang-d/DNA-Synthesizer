// Scopes localStorage keys to the logged-in user so each account
// gets its own isolated data. Falls back to "guest" when no session.
import { useState, useEffect } from "react";

export function userKey(session, key) {
  const uid = session?.user?.email ?? "guest";
  return `${uid}::${key}`;
}

export function getItem(session, key) {
  try {
    return localStorage.getItem(userKey(session, key));
  } catch {
    return null;
  }
}

export function setItem(session, key, value) {
  try {
    localStorage.setItem(userKey(session, key), value);
  } catch {}
}

export function removeItem(session, key) {
  try {
    localStorage.removeItem(userKey(session, key));
  } catch {}
}

export function getJSON(session, key, fallback) {
  try {
    const raw = getItem(session, key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(session, key, value) {
  setItem(session, key, JSON.stringify(value));
}

// Hook that re-reads from localStorage whenever the session resolves.
// Use this instead of useState(() => getJSON(...)) to avoid the
// "session is null on first render" race condition.
export function useUserStorage(session, key, fallback) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    setValue(getJSON(session, key, fallback));
  // Re-run when the user identity changes (login / logout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, key]);

  function save(newValue) {
    setJSON(session, key, newValue);
    setValue(newValue);
  }

  function clear() {
    removeItem(session, key);
    setValue(fallback);
  }

  return [value, save, clear];
}
