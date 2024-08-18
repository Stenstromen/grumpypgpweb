export const SaveToBrowserStore = async (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const LoadFromBrowserStore = (key: string) => {
  return localStorage.getItem(key);
};
