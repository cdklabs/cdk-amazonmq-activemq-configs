/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IJsiiType, JsiiType, JsiiTypeProps } from "./jsii-type";

/**
 * Represents an JSII Enum type
 */
export interface IJsiiEnum extends IJsiiType {
  readonly enumeration: { [key: string]: string };
}

/**
 * Represents an JsiiEnum constructor properties
 */
export interface JsiiEnumProps extends JsiiTypeProps {
  readonly enuemration: { [key: string]: string };
}

export class JsiiEnum extends JsiiType implements IJsiiEnum {
  public readonly enumeration: { [key: string]: string };

  constructor(props: JsiiEnumProps) {
    super(props);
    this.enumeration = props.enuemration;
  }

  public toJsiiTypeDefinition(): string {
    const enumContents: string[] = [];
    enumContents.push(`export enum ${this.name} { `);

    if (this.enumeration) {
      enumContents.push(
        ...Object.entries(this.enumeration).map(
          ([name, value]) => `${name} = '${value}',`,
        ),
      );
    }
    enumContents.push("}");
    return enumContents.join("\n");
  }
}
