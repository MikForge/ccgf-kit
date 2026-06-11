const SEED = 0xA3;

export function obfuscate(token: string): string {
    let result = '';
    for (let i = 0; i < token.length; i++) {
        result += String.fromCharCode(token.charCodeAt(i) ^ ((SEED + i) & 0xFF));
    }
    return btoa(result);
}

export function unobfuscate(encoded: string): string {
    const raw = atob(encoded);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        result += String.fromCharCode(raw.charCodeAt(i) ^ ((SEED + i) & 0xFF));
    }
    return result;
}
