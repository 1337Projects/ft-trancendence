import { Formattable } from '../blot/abstract/blot';
import Attributor from './attributor';
declare class AttributorStore {
    private attributes;
    private domNode;
    constructor(domNode: HTMLElement);
    attribute(attribute: Attributor, value: any): void;
    build(): void;
    copy(target: Formattable): void;
    move(target: Formattable): void;
    values(): {
        [key: string]: any;
    };
}
export default AttributorStore;
