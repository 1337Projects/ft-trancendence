import { Formattable, Root } from './abstract/blot';
import LeafBlot from './abstract/leaf';
declare class EmbedBlot extends LeafBlot implements Formattable {
    static formats(_domNode: HTMLElement, _scroll: Root): any;
    format(name: string, value: any): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    formats(): {
        [index: string]: any;
    };
}
export default EmbedBlot;
