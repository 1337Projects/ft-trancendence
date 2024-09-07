import Scope from '../../scope';
import { Blot, BlotConstructor, Parent, Root } from './blot';
declare class ShadowBlot implements Blot {
    scroll: Root;
    domNode: Node;
    static blotName: string;
    static className: string;
    static requiredContainer: BlotConstructor;
    static scope: Scope;
    static tagName: string;
    static create(value: any): Node;
    prev: Blot | null;
    next: Blot | null;
    parent: Parent;
    get statics(): any;
    constructor(scroll: Root, domNode: Node);
    attach(): void;
    clone(): Blot;
    detach(): void;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    isolate(index: number, length: number): Blot;
    length(): number;
    offset(root?: Blot): number;
    optimize(_context: {
        [key: string]: any;
    }): void;
    remove(): void;
    replaceWith(name: string | Blot, value?: any): Blot;
    split(index: number, _force?: boolean): Blot | null;
    update(_mutations: MutationRecord[], _context: {
        [key: string]: any;
    }): void;
    wrap(name: string | Parent, value?: any): Parent;
}
export default ShadowBlot;
