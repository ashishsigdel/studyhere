import { openDB } from "idb";

const DB_NAME = "studyhere_db";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("subjects")) {
        db.createObjectStore("subjects");
      }

      if (!db.objectStoreNames.contains("recentChapters")) {
        db.createObjectStore("recentChapters");
      }

      if (!db.objectStoreNames.contains("chapters")) {
        db.createObjectStore("chapters");
      }

      if (!db.objectStoreNames.contains("questions")) {
        db.createObjectStore("questions");
      }
      if (!db.objectStoreNames.contains("pdfs")) {
        db.createObjectStore("pdfs");
      }
    },
  });
};

// Save data to the appropriate store (subjects, chapters, or questions)
export const saveDataToIndexedDB = async (
  storeName: string,
  key: string,
  value: any
) => {
  const db = await initDB();
  await db.put(storeName, value, key); // Save data in the specific store
};

// Load data from the appropriate store
export const loadDataFromIndexedDB = async (storeName: string, key: string) => {
  const db = await initDB();
  return await db.get(storeName, key); // Load data from the specific store
};

// Delete data from the appropriate store
export const deleteDataFromIndexedDB = async (
  storeName: string,
  key: string
) => {
  const db = await initDB();
  await db.delete(storeName, key); // Delete data from the specific store
};

// Clear all data from the store
export const clearIndexedDB = async (storeName: string) => {
  const db = await initDB();
  await db.clear(storeName); // Clear all data in the store
};
