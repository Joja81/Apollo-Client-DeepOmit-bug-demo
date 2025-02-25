import { DeepOmit, Primitive } from '@apollo/client/utilities';

// Bug example

type OptionalString = {
  maybeString?: string;
  __typename: string;
};

export const v1_OptionalString: DeepOmit<OptionalString, '__typename'> = {};



// Proposed solution
export type OptionalKeysOf<Obj> = {
  [Key in keyof Obj as Omit<Obj, Key> extends Obj ? Key : never]: Obj[Key];
};

export type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmitV2<T[P], K>;
};

type DeepOmitPrimitive = Primitive | Function;

export type MandatoryKeysOf<Obj> = Omit<Obj, keyof OptionalKeysOf<Obj>>;

export type DeepOmitV2<T, K> = T extends DeepOmitPrimitive
  ? T
  : {
      [P in Exclude<keyof MandatoryKeysOf<T>, K>]: T[P] extends infer TP
        ? TP extends DeepOmitPrimitive
          ? TP
          : TP extends any[]
            ? DeepOmitArray<TP, K>
            : DeepOmitV2<TP, K>
        : never;
    } & Partial<{
      [P in Exclude<keyof OptionalKeysOf<T>, K>]: T[P] extends infer TP
        ? TP extends DeepOmitPrimitive
          ? TP
          : TP extends any[]
            ? DeepOmitArray<TP, K>
            : DeepOmitV2<TP, K>
        : never;
    }>;

export const v2_OptionalString: DeepOmitV2<OptionalString, '__typename'> = {};
