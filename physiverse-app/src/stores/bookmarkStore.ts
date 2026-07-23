'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Bookmark Store
   Persistent bookmarks for visualizations, formulas, quizzes,
   and scientists. Uses localStorage for persistence.
   ═══════════════════════════════════════════════════════════════ */

import { create } from 'zustand';
import type { Bookmark, BookmarkType } from '@/types/content';

const STORAGE_KEY = 'physiverse-bookmarks';

function loadBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    console.warn('[Physiverse] Failed to save bookmarks to localStorage');
  }
}

export interface BookmarkStoreState {
  bookmarks: Bookmark[];

  /* ── Actions ── */
  addBookmark: (type: BookmarkType, targetId: string, title: string, notes?: string) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (type: BookmarkType, targetId: string, title: string) => void;
  updateNotes: (id: string, notes: string) => void;
  isBookmarked: (targetId: string) => boolean;
  getByType: (type: BookmarkType) => Bookmark[];
  clearAll: () => void;
  hydrate: () => void;
}

export const useBookmarkStore = create<BookmarkStoreState>((set, get) => ({
  bookmarks: [],

  addBookmark: (type, targetId, title, notes) => {
    const { bookmarks } = get();
    if (bookmarks.some((b) => b.targetId === targetId && b.type === type)) return;

    const newBookmark: Bookmark = {
      id: `${type}-${targetId}-${Date.now()}`,
      type,
      targetId,
      title,
      createdAt: new Date().toISOString(),
      notes,
    };

    const updated = [newBookmark, ...bookmarks];
    set({ bookmarks: updated });
    saveBookmarks(updated);
  },

  removeBookmark: (id) => {
    const updated = get().bookmarks.filter((b) => b.id !== id);
    set({ bookmarks: updated });
    saveBookmarks(updated);
  },

  toggleBookmark: (type, targetId, title) => {
    const { bookmarks, addBookmark, removeBookmark } = get();
    const existing = bookmarks.find((b) => b.targetId === targetId && b.type === type);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark(type, targetId, title);
    }
  },

  updateNotes: (id, notes) => {
    const updated = get().bookmarks.map((b) => (b.id === id ? { ...b, notes } : b));
    set({ bookmarks: updated });
    saveBookmarks(updated);
  },

  isBookmarked: (targetId) => {
    return get().bookmarks.some((b) => b.targetId === targetId);
  },

  getByType: (type) => {
    return get().bookmarks.filter((b) => b.type === type);
  },

  clearAll: () => {
    set({ bookmarks: [] });
    saveBookmarks([]);
  },

  hydrate: () => {
    set({ bookmarks: loadBookmarks() });
  },
}));
