// utils/authStorage.ts
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WEB = Platform.OS === "web";

const store = {
  async setItem(key: string, value: string) {
    if (!WEB && (await SecureStore.isAvailableAsync())) {
      return SecureStore.setItemAsync(key, value);
    }
    return AsyncStorage.setItem(key, value);
  },

  async getItem(key: string) {
    if (!WEB && (await SecureStore.isAvailableAsync())) {
      return SecureStore.getItemAsync(key);
    }
    return AsyncStorage.getItem(key);
  },

  async removeItem(key: string) {
    if (!WEB && (await SecureStore.isAvailableAsync())) {
      return SecureStore.deleteItemAsync(key);
    }
    return AsyncStorage.removeItem(key);
  }
};

export const setToken = (value: string) => store.setItem("auth_token", value);
export const getToken = () => store.getItem("auth_token");
export const removeToken = () => store.removeItem("auth_token");

export const saveUser = async (user: { id: number; nombre: string }) => {
  await store.setItem("cliente_id", String(user.id));
  await store.setItem("cliente_nombre", user.nombre);
};

export const getUserId = async () => {
  const id = await store.getItem("cliente_id");
  return id ? parseInt(id) : null;
};