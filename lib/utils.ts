type ClassValue = string | number | boolean | undefined | null | ClassValue[];

function flatten(input: ClassValue): string[] {
  if (input === undefined || input === null || input === false) return [];
  if (typeof input === "string" && input.length > 0) return [input];
  if (typeof input === "number") return [String(input)];
  if (Array.isArray(input)) return input.flatMap(flatten);
  return [];
}

export function cn(...inputs: ClassValue[]) {
  return inputs.flatMap(flatten).filter(Boolean).join(" ");
}
