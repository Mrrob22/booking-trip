export async function unwrap<T>(resp: Response): Promise<T> {
    const json = await resp.json();
    if (!resp.ok) {
        const err = new Error(json?.message || "API error");
        (err as any).status = resp.status;
        (err as any).payload = json;
        throw err;
    }
    return json as T;
}
