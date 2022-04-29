const BASE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export const getFileUrl = (filename: string, directory?: string) =>
  `${BASE_URL}/${directory ? `${directory}/` : ""}${filename}`;
