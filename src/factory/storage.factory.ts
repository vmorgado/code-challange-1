import { ConfigService } from "@nestjs/config";
import { StorageInterface } from "../interface/storage.interface";

export const storageFactory = (configService: ConfigService, prefix: string, redis: StorageInterface ): StorageInterface => {

  const removePrefix = (prefixedKey: string) => prefixedKey.replace(`_${prefix}`, '');

  const get = async (key: string): Promise<string | null> => {
    const result = await redis.get(`${key}_${prefix}`);
    return typeof result == 'string' ? JSON.parse(result) : null;
  };
  const set = async (key: string, value: any, ttl: number): Promise<void> => await redis.setex(`${key}_${prefix}`, ttl, JSON.stringify(value));
  const keys = async (pattern: string): Promise<any> => {
    const keys = await redis.keys(pattern);

    return await Promise.all(keys.map((key: string) => get(removePrefix(key)))).then(async (results) => results);
  }

  const command = async (...parameters: string[] | number[]): Promise<any> => {
    const keys = await redis.command(...parameters)
    return await Promise.all(keys.map((key: string) => get(removePrefix(key)))).then(async (results) => results);
  }

  const setex = async (key: string, seconds: number, value: string): Promise<void> => {
    return await set(key, value, seconds);
  };

  return { get, set, keys, command, setex };
};
 