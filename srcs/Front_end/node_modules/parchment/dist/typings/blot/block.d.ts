import AttributorStore from '../attributor/store';
import Scope from '../scope';
import { Blot, BlotConstructor, Formattable, Root } from './abstract/blot';
import ParentBlot from './abstract/parent';
declare class BlockBlot extends ParentBlot implements Formattable {
    static blotName: string;
    static scope: Scope;
    static tagName: string;
    static allowedChildren: BlotConstructor[];
    static formats(domNode: HTMLElement, scroll: Root): any;
    protected attributes: AttributorStore;
    constructor(scroll: Root, domNode: Node);
    format(name: string, value: any): void;
    formats(): {
        [index: string]: any;
    };
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    replaceWith(name: string | Blot, value?: any): Blot;
    update(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
}
export default BlockBlot;
