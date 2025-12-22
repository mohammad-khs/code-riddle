export const parseAccept = (accept: string) => {
  const rules = {
    mimeGroups: [] as string[],
    mimeTypes: [] as string[],
    extensions: [] as string[],
  };

  accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .forEach((type) => {
      if (type.startsWith(".")) {
        rules.extensions.push(type);
      } else if (type.endsWith("/*")) {
        rules.mimeGroups.push(type.replace("/*", ""));
      } else if (type.includes("/")) {
        rules.mimeTypes.push(type);
      }
    });

  return rules;
};

export const isFileTypeAllowed = (file: File, accept: string): boolean => {
  if (!accept) return true;

  const { mimeGroups, mimeTypes, extensions } = parseAccept(accept);

  const fileMime = file.type.toLowerCase();
  const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;

  if (mimeTypes.includes(fileMime)) return true;
  if (mimeGroups.some((group) => fileMime.startsWith(`${group}/`))) return true;
  if (extensions.includes(fileExt)) return true;

  return false;
};

export const formatAcceptForHumans = (accept: string) =>
  accept
    .split(",")
    .map((t) => t.replace("*", "").replace("/", " ").trim())
    .join(", ");
