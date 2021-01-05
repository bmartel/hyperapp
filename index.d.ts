type SSR_NODE = 1;
type TEXT_NODE = 3;

type ClassProp = false | string | undefined | Record<string, boolean | undefined> | ClassProp[]

type StyleProp
  = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null }
  // For some reason we need this to prevent `style` from being a string.
  & { [index: number]: never }

type EventActions<S> = { [K in keyof EventsMap]?: Action<S, EventsMap[K]> }
type EventsMap
  = { [K in keyof HTMLElementEventMap as `on${K}`]: HTMLElementEventMap[K] }
  & { [K in keyof WindowEventMap as `on${K}`]: WindowEventMap[K] }
  & { onsearch: Event }

  type PropList<T= {}, S = any> = Readonly<ElementCreationOptions & EventActions<S> & T & {
    class?: ClassProp
    key?: Key
    style?: StyleProp
  }>

export type VirtualElementType = keyof HTMLElementTagNameMap;

export interface VirtualElement<T = {}> {
  type: VirtualElementType;
  props: PropList<T>;
  children: Array<VirtualElement>;
  node?: Node | null;
  key?: string | null;
  tag?: SSR_NODE | TEXT_NODE;
}

export interface TextNode extends Omit<VirtualElement, "type"> {
  type: string | number;
  tag: TEXT_NODE;
}

export interface RecycledNode extends VirtualElement {
  tag: SSR_NODE;
}

export type VirtualNode<T = {}> =
  | VirtualElement<T>
  | TextNode
  | RecycledNode
  | MemoizedNode<T>;

export type Children = VirtualNode | Array<VirtualNode>;

export type View<T = {}> = (props?: PropList<T>, children?: Children) => VirtualNode<T>;

export interface MemoizedNode<T = {}> {
  tag: View<T>;
  memo: T;
}

export function h<T = {}>(
  name: string,
  options: T,
  children?: Children
): VirtualElement<T>;
export function text(value: string): TextNode;
export function memo<T = {}>(component: View<T>, props: PropList<T>): MemoizedNode<T>;

export type Mutation<S = any, T = any, R = any> = (
  dispatch: Dispatch<S, T>,
  props?: T
) => R|void|Promise<R | void>;

export type Effect<S = any, T = any, R = any> = [Mutation<S, T, R>, T | undefined];

export type StateWithEffects<S = any, T = any> = [S, Array<Effect<S, T>>];
export type StateTransition<S = any, T = any> = S | StateWithEffects<S, T>;
export type Action<S = any, T = any> = (
  state: S,
  props?: T
) => StateTransition<S, T>;

export type Dispatch<S = any, T = any> = (action: Action<S, T>, props?: T) => S;

export type Middleware<S = any, T = any> = (
  dispatch: Dispatch<S, T>
) => Dispatch<S, T>;

type Unsubscribe = () => void

export type Subscription<S = any, T = any> = Effect<S, T, Unsubscribe>;

type App<S = any> = Readonly<{
  init: StateTransition<S>;
  view: View<S>;
  node: Node;
  subscriptions?: Array<Subscription<S>>;
  middleware?: Array<Middleware<S>>;
}>;

export function app<S = any>(config: App<S>): void;
