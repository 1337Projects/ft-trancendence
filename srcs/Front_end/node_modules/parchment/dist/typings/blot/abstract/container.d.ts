import Scope from '../../scope';
import BlockBlot from '../block';
import ParentBlot from './parent';
declare class ContainerBlot extends ParentBlot {
    static blotName: string;
    static scope: Scope;
    static tagName: string;
    prev: BlockBlot | ContainerBlot | null;
    next: BlockBlot | ContainerBlot | null;
    checkMerge(): boolean;
    deleteAt(index: number, length: number): void;
    formatAt(index: number, length: number, name: string, value: any): void;
    insertAt(index: number, value: string, def?: any): void;
    optimize(context: {
        [key: string]: any;
    }): void;
}
export default ContainerBlot;
