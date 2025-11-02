export const USD_TO_UAH = 41.5;

export function toUAH(amount: number, currency: string = "usd"): number {
    const cur = (currency || "usd").toLowerCase();
    if (!Number.isFinite(amount)) return 0;
    switch (cur) {
        case "uah":
            return amount;
        case "usd":
            return amount * USD_TO_UAH;
        default:
            return amount;
    }
}

export function formatUAH(n: number): string {
    try {
        return new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
            maximumFractionDigits: 0,
        })
            .format(n || 0)
            .replace(/\u00A0/g, " ");
    } catch {
        return `${Math.round(n || 0).toLocaleString("uk-UA")} грн`;
    }
}

export function formatDateUA(date: string): string {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date;
    return d.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export const normalize = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/’/g, "'")
        .trim();

export const includesNormalized = (haystack: string, needle: string) =>
    normalize(haystack).includes(normalize(needle));