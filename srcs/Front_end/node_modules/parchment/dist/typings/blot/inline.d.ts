import AttributorStore from '../attributor/store';
import Scope from '../scope';
import { Blot, BlotConstructor, Formattable, Parent, Root } from './abstract/blot';
import ParentBlot from './abstract/parent';
declare class InlineBlot extends ParentBlot implements Formattable {
    static allowedChildren: BlotConstructor[];
    static blotName: string;
    static scope: Scope;
    static tagName: string;
    static formats(domNode: HTMLElement, scroll: Root): any;
    protected attributes: AttributorStore;
    constructor(scroll: Root, domNode: Node);
    format(name: string, value: any): void;
    formats(): {
        [index: string]: any;
    };
    formatAt(index: number, length: number, name: string, value: any): void;
    optimize(context: {
        [key: string]: any;
    }): void;
    replaceWith(name: string | Blot, value?: any): Blot;
    update(mutations: MutationRecord[], context: {
        [key: string]: any;
    }): void;
    wrap(name: string | Parent, value?: any): Parent;
}
export default InlineBlot;
