/// <reference types="vite/client" />


declare module 'windows' {
    export function registry(key: string): KeySet;

    interface KeySet {
        // Remove a KeySet recursively or a child
        remove(name: string): boolean | string;

        // Add a new child to this KeySet
        add(name: string, value: any): boolean;

        // Get a child KeySet
        [name: string]: KeySet | Entry;
    }

    interface Entry {
        // Remove the value from the registry. It's still available in JavaScript though
        remove(): boolean;

        inspect(): any;

        valueOf(): any;

        parent: KeySet;
        name: string;
        value: any;
        type: RegType;
        raw: any;
    }

    type RegType =
        'REG_NONE'
        | 'REG_SZ'
        | 'REG_EXPAND_SZ'
        | 'REG_BINARY'
        | 'REG_DWORD'
        | 'REG_MULTI_SZ'
        | 'REG_QWORD';
}
