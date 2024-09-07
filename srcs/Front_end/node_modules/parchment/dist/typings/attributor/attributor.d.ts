import Scope from '../scope';
export interface AttributorOptions {
    scope?: Scope;
    whitelist?: string[];
}
export default class Attributor {
    static keys(node: HTMLElement): string[];
    attrName: string;
    keyName: string;
    scope: Scope;
    whitelist: string[] | undefined;
    constructor(attrName: string, keyName: string, options?: AttributorOptions);
    add(node: HTMLElement, value: string): boolean;
    canAdd(_node: HTMLElement, value: any): boolean;
    remove(node: HTMLElement): void;
    value(node: HTMLElement): string;
}
