import AsyncStorage from "@react-native-async-storage/async-storage";
import { PixabayModel } from "@/models/PixabayModel";

const AUTH_KEY = "authToken";
const BOOKMARKS_KEY = "bookmarkedItems";

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(AUTH_KEY, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem(AUTH_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(AUTH_KEY);
};

export const getBookmarks = async (): Promise<PixabayModel[]> => {
  const bookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY);
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const addBookmark = async (item: PixabayModel) => {
  const bookmarks = await getBookmarks();
  const updatedBookmarks = [...bookmarks, item];
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
};

export const removeBookmark = async (id: number) => {
  const bookmarks = await getBookmarks();
  const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
};
