const SSR_NODE: 1;
const TEXT_NODE: 3;

export type VirtualNodeType =
  | keyof HTMLElementTagNameMap
  | TEXT_NODE
  | SSR_NODE;

export interface VirtualNode<T = {}> {
  type: VirtualNodeType;
  props: T;
  children: Array<VirtualNode>;
  node?: null | Node;
  key?: string | null;
  tag?: SSR_NODE | TEXT_NODE;
}

export interface TextNode extends VirtualNode {
  type: string | number;
  tag: TEXT_NODE;
}

export interface RecycledNode extends VirtualNode {
  tag: SSR_NODE;
}

export type View<T = {}> = (
  props?: T,
  children?: Array<VirtualNode>
) => VirtualNode<T>;

export interface MemoizedNode<T = {}> {
  tag: View<T>;
  memo: T;
}

export type CreateVirtualNode<T = {}> = (
  name: string,
  options: T,
  children?: VirtualNode | Array<VirtualNode>
) => VirtualNode<T>;

export type CreateTextNode = (value: string) => TextNode;

export type CreateMemoizedNode<T = {}> = (
  component: View<T>,
  props: T
) => MemoizedNode<T>;

export const h: CreateVirtualNode;
export const text: CreateTextNode;
export const memo: CreateMemoizedNode;

export type EffectUpdate<S = any, T = any> = (
  dispatch: Dispatch<S, T>,
  props?: T
) => any;
export type Effect<S = any, T = any> = [EffectUpdate<S, T>, T | undefined];

export type ActionEffect<S = any, T = any> = [S, Array<Effect<S, T>>];
export type ActionUpdate<S = any, T = any> = S | ActionEffect<S, T>;
export type Action<S = any, T = any> = (
  state: S,
  props?: T
) => ActionUpdate<S, T>;

export type Dispatch<S = any, T = any> = (action: Action<S, T>, props?: T) => S;

export type Middleware<S = any, T = any> = (
  next: Dispatch<S, T>
) => Dispatch<S, T>;

export type SubscriptionUpdate<S = any, T = any> = (
  dispatch: Dispatch<S, T>,
  props?: T
) => () => void;
export type Subscription<S = any, T = any> = [
  SubscriptionUpdate<S, T>,
  T | undefined
];

interface AppConfig<S = any> {
  init: S | ActionEffect<S>;
  view: View<S>;
  node: Node;
  subscriptions?: Array<Subscription<S>>;
  middleware?: Array<Middleware<S>>;
}

export type App = (config: AppConfig) => void;

export const app: App;
