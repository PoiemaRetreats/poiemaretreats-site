export function recordingYear(data: { date?: unknown; title?: unknown }): string {
  const date = data.date ? new Date(String(data.date)) : null;
  if (date && Number.isFinite(date.getTime())) return String(date.getUTCFullYear());
  return String(data.title || '').match(/\b(?:19|20)\d{2}\b/)?.[0] || '';
}

export function recordingTime(data: { date?: unknown; title?: unknown }): number {
  const date = data.date ? Date.parse(String(data.date)) : NaN;
  if (Number.isFinite(date)) return date;
  const year = recordingYear(data);
  return year ? Date.UTC(Number(year), 0, 1) : 0;
}

export function recordingRetreat(data: { title?: unknown; retreat_name?: unknown }): string {
  if (typeof data.retreat_name === 'string' && data.retreat_name.trim()) return data.retreat_name.trim();
  return String(data.title || '').match(/^(.+?\b(?:19|20)\d{2})\b/)?.[1] || 'Other recordings';
}
