import AsyncStorage from '@react-native-community/async-storage'

export const MAIN_MENU_KEY = "mainMenu";
export const FAVORITE_KEY = "FavoriteItems";
export const CREDENTIALS = "credentials"
export const IS_RTL = "isRTL"

export const getMainMenu = async (currentUser) => {
  if (!currentUser) return null;
  const mainMenu = await AsyncStorage.getItem(`${MAIN_MENU_KEY}.${currentUser.username}`);
  if (!mainMenu) return [];
  return JSON.parse(mainMenu);
};

export const setMainMenu = async (currentUser, mainMenu) => {
  if (!currentUser) return;
  await AsyncStorage.setItem(`${MAIN_MENU_KEY}.${currentUser.username}`, JSON.stringify(mainMenu));
};

export const getFavoriteItems = async (currentUser) => {
  if (!currentUser) return null;
  const favorite = await AsyncStorage.getItem(`${FAVORITE_KEY}.${currentUser.username}`);
  if (!favorite) return [];
  return JSON.parse(favorite);
};

export const setFavoriteItems = async (currentUser, favorite) => {
  if (!currentUser) return;
  if (Array.isArray(favorite)) {
    await AsyncStorage.setItem(`${FAVORITE_KEY}.${currentUser.username}`, JSON.stringify(favorite));
  }
};

export const setCurrentUserCredentials = async (userName, password) => {
  console.log("CURRENTUSERINSTORAGE:::",JSON.stringify({ userName, password }))
  await AsyncStorage.setItem(CREDENTIALS, JSON.stringify({ userName, password }));

}

export const getCurrentUserCredentials = async ()=>{
  const credentials =JSON.parse(await AsyncStorage.getItem(CREDENTIALS));
  return credentials
}

export const setisRTL = async (isRTL) => {
  await AsyncStorage.setItem(IS_RTL, JSON.stringify(isRTL));
}

export const getisRTL = async () => {
  return AsyncStorage.getItem(IS_RTL);
  // console.log("isRTL in getisRTL")
  // console.log(isRTL)
  // return JSON.parse(isRTL)
}

