export interface DesignEntry {
  id: string;
  brief: string;
  html: string;
  bodyHtml: string;
  createdAt: string; // ISO string
  thumbnail?: string; // future: base64 screenshot
}

const STORAGE_KEY = "cyan-design-history";
const MAX_ENTRIES = 50;

export function loadHistory(): DesignEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: Omit<DesignEntry, "id" | "createdAt">): DesignEntry {
  const history = loadHistory();
  const newEntry: DesignEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export function deleteFromHistory(id: string): void {
  const history = loadHistory();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history.filter((e) => e.id !== id))
  );
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}
