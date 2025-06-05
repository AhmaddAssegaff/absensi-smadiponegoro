export function enumValueToUrl(value: string) {
  return value.toLowerCase().replace(/_/g, "-");
}

export function urlToEnumValue(url?: string): string | undefined {
  if (!url) return undefined;
  return url.toUpperCase().replace(/-/g, "_");
}

export function formatEnumToLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatClassNameLabel(value: string): string {
  if (!value) return "-";

  const romawiToAngka: Record<string, string> = {
    X: "10",
    XI: "11",
    XII: "12",
  };

  const parts = value?.split("_") ?? [];

  const rawTingkat = parts[0];
  const rawJurusan = parts[1];
  const rawKelamin = parts[2];

  const kelas =
    rawTingkat && romawiToAngka[rawTingkat]
      ? romawiToAngka[rawTingkat]
      : (rawTingkat ?? "-");
  const jurusan = rawJurusan?.toUpperCase() ?? "-";
  const jenisKelamin = rawKelamin
    ? rawKelamin.charAt(0).toUpperCase() + rawKelamin.slice(1).toLowerCase()
    : "-";

  return [kelas, jurusan, jenisKelamin].join(" ");
}
