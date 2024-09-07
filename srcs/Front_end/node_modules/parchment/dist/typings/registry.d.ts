import Attributor from './attributor/attributor';
import { Blot, BlotConstructor, Root } from './blot/abstract/blot';
import Scope from './scope';
export interface RegistryInterface {
    create(sroll: Root, input: Node | string | Scope, value?: any): Blot;
    query(query: string | Node | Scope, scope: Scope): Attributor | BlotConstructor | null;
    register(...definitions: any[]): any;
}
export default class Registry implements RegistryInterface {
    static blots: WeakMap<Node, Blot>;
    static find(node: Node | null, bubble?: boolean): Blot | null;
    private attributes;
    private classes;
    private tags;
    private types;
    create(scroll: Root, input: Node | string | Scope, value?: any): Blot;
    find(node: Node | null, bubble?: boolean): Blot | null;
    query(query: string | Node | Scope, scope?: Scope): Attributor | BlotConstructor | null;
    register(...definitions: any[]): any;
}
