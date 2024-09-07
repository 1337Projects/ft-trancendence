import { createComponentVNode, Props, VNode } from 'inferno';
declare type InfernoComponent = Parameters<typeof createComponentVNode>[1];
export declare const getTemplate: (TemplateProp: InfernoComponent & {
    defaultProps: unknown;
}) => Function | import("inferno").ForwardRef | import("inferno").IComponent<any, any> | ((props?: Props<unknown, Element> | null | undefined) => VNode);
export {};
