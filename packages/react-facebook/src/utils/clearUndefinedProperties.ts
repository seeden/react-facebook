type NonNullProperties<T> = { 
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

export default function clearUndefinedProperties<T extends {}, V = NonNullProperties<T>>(obj: T): V {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as V;
}
