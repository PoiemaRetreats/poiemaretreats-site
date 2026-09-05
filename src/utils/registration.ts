export const OBX_FORM_ID = 'aa7f78b7-1076-4016-a63b-047c6243fb71';
export function retreatFormId(slug: string, configured?: unknown): string | undefined {
  const value = typeof configured === 'string' ? configured.trim() : '';
  const id = value.includes('formId=') ? value.split('formId=')[1].split('&')[0] : value;
  if (/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) return id;
  return slug === 'poiema-obx-2026' ? OBX_FORM_ID : undefined;
}
