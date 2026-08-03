import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuthData = async (token, role, userInfo = null) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', role);
    if (userInfo) {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

export const getAuthData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const role = await AsyncStorage.getItem('userRole');
    const userInfoRaw = await AsyncStorage.getItem('userInfo');
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
    return { token, role, userInfo };
  } catch (error) {
    console.error('Error reading auth data:', error);
    return { token: null, role: null, userInfo: null };
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userInfo');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};
