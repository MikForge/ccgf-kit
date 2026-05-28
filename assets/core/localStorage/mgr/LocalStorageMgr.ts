import { Singleton } from "db://assets/core/common";
import { LocalStorageKey } from "../defines/ls.enum";

export class LocalStorageMgr extends Singleton<LocalStorageMgr> {

    private storage: Storage;

    constructor() {
        super();
        this.storage = localStorage;
    }

    public setItem(key: LocalStorageKey, value: string): void {
        try {
            this.storage.setItem(key, value);
        } catch (e) {
            H.log.error(`LocalStorageMgr: Failed to set item with key "${key}". Error: ${e}`);
        }
    }

    public getItem(key: LocalStorageKey): string | null {
        try {
            return this.storage.getItem(key);
        } catch (e) {
            H.log.error(`LocalStorageMgr: Failed to get item with key "${key}". Error: ${e}`);
            return null;
        }
    }
}