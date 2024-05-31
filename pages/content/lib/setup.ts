import { appStorage } from '@chrome-extension-boilerplate/storage';

export const getApiKey = async () => {
  const app = await appStorage.get();
  console.log('Get app storage: ', app);
  return app.apiKey;
};
