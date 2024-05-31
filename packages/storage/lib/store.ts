import { BaseStorage, createStorage, StorageType } from './base';

type AppStore = {
  apiKey: string | null;
};

type AppStorage = BaseStorage<AppStore> & {
  setApiKey: (apiKey: string) => Promise<void>;
};

const storage = createStorage<AppStore>(
  'shopify-chrom-extension',
  {
    apiKey: null,
  },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

export const appStorage: AppStorage = {
  ...storage,
  // TODO: extends your own methods
  setApiKey: async (apiKey: string) => {
    await storage.set({
      apiKey,
    });
  },
};
