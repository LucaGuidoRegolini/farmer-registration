export interface PrismaOptionsInterface<T> {
  where?: Partial<T> | PrismaWhereOptionsInterface<Partial<T>>;
  skip?: number;
  take?: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
}

export interface PrismaWhereOptionsInterface<K> {
  [key: string]: {
    contains: K;
    mode?: 'insensitive' | 'default';
    endsWith?: K | string;
    startsWith?: K | string;
  };
}
