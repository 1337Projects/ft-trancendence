import LinkedList from '../../collection/linked-list';
import { Blot, BlotConstructor, Parent, Root } from './blot';
import ShadowBlot from './shadow';
declare class ParentBlot extends ShadowBlot implements Parent {
    static allowedChildren: BlotConstructor[] | null;
    static defaultChild: BlotConstructor | null;
    static uiClass: string;
    children: LinkedList<Blot>;
    domNode: HTMLElement;
    uiNode: HTMLElement | null;
    constructor(scroll: Root, domNode: Node);
    appendChild(other: Blot): void;
    attach(): void;
    attachUI(node: HTMLElement): void;
    build(): void;
    deleteAt(index: number, length: number): void;
    descendant(criteria: new () => Blot, index: number): [Blot | null, number];
    descendant(criteria: (blot: Blot) => boolean, index: number): [Blot | null, number];
    descendants(criteria: new () => Blot, index: number, length: number): Blot[];
    descendants(criteria: (blot: Blot) => boolean, index: number, length: number): Blot[];
    detach(): void;
    enforceAllowedChildren(): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    insertBefore(childBlot: Blot, refBlot?: Blot | null): void;
    length(): number;
    moveChildren(targetParent: Parent, refNode?: Blot): void;
    optimize(context: {
        [key: string]: any;
    }): void;
    path(index: number, inclusive?: boolean): [Blot, number][];
    removeChild(child: Blot): void;
    replaceWith(name: string | Blot, value?: any): Blot;
    split(index: number, force?: boolean): Blot | null;
    splitAfter(child: Blot): Parent;
    unwrap(): void;
    update(mutations: MutationRecord[], _context: {
        [key: string]: any;
    }): void;
}
export default ParentBlot;
