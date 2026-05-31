export const delay = (ms = 300): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createMockService = <T extends { id: string }>(initialItems: T[]) => {
  let items = [...initialItems];

  return {
    getAll: async (): Promise<T[]> => {
      await delay();
      return [...items];
    },
    getById: async (id: string): Promise<T | undefined> => {
      await delay(150);
      return items.find((item) => item.id === id);
    },
    create: async (data: Omit<T, "id">): Promise<T> => {
      await delay();
      const item = { ...data, id: Date.now().toString() } as T;
      items = [item, ...items];
      return item;
    },
    update: async (id: string, data: Partial<T>): Promise<T> => {
      await delay();
      items = items.map((item) => (item.id === id ? { ...item, ...data } : item));
      const updated = items.find((item) => item.id === id);
      if (!updated) {
        throw new Error(`Record ${id} not found`);
      }
      return updated;
    },
    delete: async (id: string): Promise<void> => {
      await delay();
      items = items.filter((item) => item.id !== id);
    }
  };
};
