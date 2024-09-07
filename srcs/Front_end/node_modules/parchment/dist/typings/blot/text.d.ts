import Scope from '../scope';
import { Blot, Leaf, Root } from './abstract/blot';
import LeafBlot from './abstract/leaf';
declare class TextBlot extends LeafBlot implements Leaf {
    static blotName: string;
    static scope: Scope;
    static create(value: string): Text;
    static value(domNode: Text): string;
    domNode: Text;
    protected text: string;
    constructor(scroll: Root, node: Node);
    deleteAt(index: number, length: number): void;
    index(node: Node, offset: number): number;
    insertAt(index: number, value: string, def?: any): void;
    length(): number;
    optimize(context: {
        [key: string]: any;
    }): void;
    position(index: number, _inclusive?: boolean): [Node, number];
    split(index: number, force?: boolean): Blot | null;
    update(mutations: MutationRecord[], _context: {
        [key: string]: any;
    }): void;
    value(): string;
}
export default TextBlot;
