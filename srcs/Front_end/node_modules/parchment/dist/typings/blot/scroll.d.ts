import Attributor from '../attributor/attributor';
import Registry from '../registry';
import Scope from '../scope';
import { Blot, BlotConstructor, Root } from './abstract/blot';
import ParentBlot from './abstract/parent';
import BlockBlot from './block';
declare class ScrollBlot extends ParentBlot implements Root {
    static blotName: string;
    static defaultChild: typeof BlockBlot;
    static allowedChildren: BlotConstructor[];
    static scope: Scope;
    static tagName: string;
    registry: Registry;
    observer: MutationObserver;
    constructor(registry: Registry, node: HTMLDivElement);
    create(input: Node | string | Scope, value?: any): Blot;
    find(node: Node | null, bubble?: boolean): Blot | null;
    query(query: string | Node | Scope, scope?: Scope): Attributor | BlotConstructor | null;
    register(...definitions: any[]): any;
    build(): void;
    detach(): void;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    optimize(context: {
        [key: string]: any;
    }): void;
    optimize(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
    update(mutations?: MutationRecord[], context?: {
        [key: string]: any;
    }): void;
}
export default ScrollBlot;
