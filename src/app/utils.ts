export const formatMoney = (amount: number, currency = "usd") =>
    new Intl.NumberFormat("uk-UA", { style: "currency", currency: currency.toUpperCase() })
        .format(amount)
        .replace(/\u00A0/g, " ");

export const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
};

export const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/’/g, "'")
        .trim();

export const includesNormalized = (haystack: string, needle: string) =>
    normalize(haystack).includes(normalize(needle));