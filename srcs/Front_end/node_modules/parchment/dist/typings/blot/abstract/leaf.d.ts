import Scope from '../../scope';
import { Leaf } from './blot';
import ShadowBlot from './shadow';
declare class LeafBlot extends ShadowBlot implements Leaf {
    static scope: Scope;
    static value(_domNode: Node): any;
    index(node: Node, offset: number): number;
    position(index: number, _inclusive?: boolean): [Node, number];
    value(): any;
}
export default LeafBlot;
