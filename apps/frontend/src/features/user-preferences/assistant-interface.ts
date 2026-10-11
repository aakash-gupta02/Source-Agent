"use client";

import { useSyncExternalStore } from "react";

export type AssistantInterface = "orb" | "robot";

const STORAGE_KEY = "sql-agent:assistant-interface";
const CHANGE_EVENT = "assistant-interface-change";
const DEFAULT_INTERFACE: AssistantInterface = "orb";

function isAssistantInterface(value: unknown): value is AssistantInterface {
  return value === "orb" || value === "robot";
}

function getSnapshot(): AssistantInterface {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isAssistantInterface(value) ? value : DEFAULT_INTERFACE;
  } catch {
    return DEFAULT_INTERFACE;
  }
}

function getServerSnapshot(): AssistantInterface {
  return DEFAULT_INTERFACE;
}

function subscribe(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function setAssistantInterface(value: AssistantInterface) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useAssistantInterface() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
