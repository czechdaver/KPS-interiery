/** Formátovací pomocníci bez závislostí (použitelné i v klientském JS). */
/** Česká plurálová forma: 1 realizace, 2–4 realizace, 5+ realizací */
export const plural = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);
export const realizaceLabel = (n: number) => `${n} ${plural(n, 'realizace', 'realizace', 'realizací')}`;
export const fotoLabel = (n: number) => `${n} ${plural(n, 'fotografie', 'fotografie', 'fotografií')}`;

/** Rozdělí titulek na části kolem zvýrazněného slova (vysází se kurzívou). */
export const splitAccent = (title: string, accent?: string) => {
  const i = accent ? title.indexOf(accent) : -1;
  if (i < 0 || !accent) return { before: title, accent: '', after: '' };
  return { before: title.slice(0, i), accent, after: title.slice(i + accent.length) };
};
