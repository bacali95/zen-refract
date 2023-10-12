import { ReferentialAction, Scalar } from './fields';

import { JsonValue } from '../codegen/lib/json';
import { MergeDbModifiers } from './modifiers';
import { Model } from './blocks';
import { Types } from '..';

type Append<T, K> = { [index in keyof T]: T[index] & K };

export type Scalars = Append<
  {
    String: {
      unique?: true;
      id?: true;
      default?: string | 'auto()';
      limit?: number;
    };
    Int: {
      unique?: true;
      id?: true;
      default?: 'cuid()' | 'autoincrement()' | 'uuid()' | number;
    };
    Float: {
      unique?: true;
      default?: number;
    };
    BigInt: {
      unique?: true;
      default?: BigInt;
    };
    Bytes: {
      unique?: true;
      default?: never;
    };
    Decimal: {
      unique?: true;
      default?: number;
    };
    Boolean: {
      unique?: true;
      default?: boolean;
    };
    DateTime: {
      default?: 'now()';
      updatedAt?: true;
    };
    Json: { default?: JsonValue };
  },
  {
    nullable?: boolean;
    map?: string;
    ignore?: true;
    raw?: string;
    array?: true;
    comment?: string;
    password?: {
      saltLength?: number;
      salt?: string;
    };
    omit?: true;
    'prisma.passthrough': string;
    allow: {
      operation: 'all' | ('read' | 'update')[];
      condition: string;
    };
    deny: {
      operation: 'all' | ('read' | 'update')[];
      condition: string;
    };
  }
>;

export type Enums = {
  Enum: {
    id?: true;
    nullable?: boolean;
    default?: string;
    ignore?: true;
    comment?: string;

    // Enum of which this is from
    enum: string;
  };
  // An entry in the enum, e.g. Enum("name", Key("Id", Map("_id")))
  EnumKey: {
    map?: string;
    comment?: string;
  };
};

export type Reference = [
  reference: string,
  scalar?: Types.Fields.Field<'Int'> | Types.Fields.Field<'String'>,
];

export type Relations = Append<
  {
    OneToMany: {};
    OneToOne: {
      fields?: string[] | Reference;
      references?: string[];
      onUpdate?: ReferentialAction;
      onDelete?: ReferentialAction;
      nullable?: boolean;
    };
    ManyToOne: {
      fields: string[] | Reference;
      references: string[];
      onUpdate?: ReferentialAction;
      onDelete?: ReferentialAction;
      nullable?: boolean;
    };
  },
  { name?: string; model: Model; comment?: string }
>;

export type Compounds = Append<
  {
    '@@id': {};
    '@@unique': { map: string };
    '@@index': { map: string };
    '@@ignore': {};
    '@@map': {};
    '@@fulltext': {};
  },
  { values: string[]; comment?: string }
> &
  Append<
    {
      '@@allow': {};
      '@@deny': {};
    },
    {
      operation: 'all' | ('create' | 'read' | 'update' | 'delete')[];
      condition: string;
    }
  > & {
    '@@prisma.passthrough': { text: string };
  };

export type TypeData = MergeDbModifiers<Scalars> &
  Compounds &
  Enums &
  Relations & {
    Comment: { value: string };
    Raw: { value: string };
    Unsupported: { unsupported: string; nullable?: boolean };
  };

// All possible column datatypes & their accepted modifiers/parameters
export type Type = keyof TypeData;
