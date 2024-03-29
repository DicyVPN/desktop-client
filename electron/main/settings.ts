import {DATA_PATH} from './globals';
import fs from 'fs';

type Settings = {
    [key: string]: Value;
}

export type Value = null | boolean | string | number | Settings | Value[];
let loadedSettings: Settings | null = null;

function rawLoadSettingsFile(): Settings {
    if (loadedSettings !== null) {
        return loadedSettings;
    }
    const settingsFilePath = DATA_PATH + '/settings.json';
    if (!fs.existsSync(settingsFilePath)) {
        return {};
    }
    const rawSettings = fs.readFileSync(settingsFilePath, 'utf8');
    loadedSettings = JSON.parse(rawSettings);
    return loadedSettings!;
}

function rawSaveSettingsFile(settings: Settings) {
    const settingsFilePath = DATA_PATH + '/settings.json';
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}

const settingsApi = {
    /**
     * @param key The key to get the value for. Can be a nested key, e.g. `foo.bar.baz` or `foo[0].bar`.
     * @param defaultValue The value to return if the key does not exist.
     */
    get<T extends Value | undefined>(key: string, defaultValue?: T): T {
        const settings = rawLoadSettingsFile();
        const keys = key.split(/[.\[\]]/).filter(k => k.length > 0);
        let value: Value = settings;
        for (const k of keys) {
            if (value === null || typeof value !== 'object') {
                return defaultValue as T;
            }
            value = value[k] as Settings;
        }
        return value === null || value === undefined ? defaultValue as T : value as T;
    },
    /**
     * @param key The key to set the value for. Can be a nested key, e.g. `foo.bar.baz` or `foo[0].bar`.
     * @param value The value to set.
     */
    set(key: string, value: Value) {
        const settings = rawLoadSettingsFile();
        const keys = key.split(/[.\[\]]/).filter(k => k.length > 0);
        let obj: Settings = settings;
        for (const k of keys.slice(0, keys.length - 1)) {
            if (obj[k] === null || typeof obj[k] !== 'object') {
                obj[k] = {};
            }
            obj = obj[k] as Settings;
        }
        obj[keys[keys.length - 1]] = value;
        rawSaveSettingsFile(settings);
    }
};

export default settingsApi;
export type SettingsAPI = typeof settingsApi;
