type EnvType = 'MONGODB_CONN' | 'MONGO_DBNAME' | 'PORT';

export function GetEnv(key: EnvType): string {
  return process.env[key]?.toString() || '';
}