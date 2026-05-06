/** Une mensajes de validación (Zod / formulario) para descripciones en toast. */
export function joinFormErrorMessages(
  errors: Record<string, string | string[] | undefined> | undefined
): string | undefined {
  if (!errors) return undefined;
  const parts: string[] = [];
  for (const v of Object.values(errors)) {
    if (v == null) continue;
    if (Array.isArray(v)) parts.push(...v.filter(Boolean));
    else parts.push(v);
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}
