export interface StorageInterface {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl: number): Promise<void>;
  keys(pattern: string): Promise<any>;
  command(...parameters: any): Promise<any>;
  setex(key: string, seconds: number, value: string): Promise<void>;  
}
