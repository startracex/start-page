const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const toPublicPath = (path: string) => {
  if (!path.startsWith("/")) {
    return path;
  }
  return `${base}${path}`;
};
