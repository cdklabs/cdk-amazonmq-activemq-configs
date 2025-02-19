/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IJsiiProperty } from "./jsii-property";
import { IJsiiType, JsiiType, JsiiTypeProps } from "./jsii-type";

/**
 * Represents a JSII struct (structural interface) type
 */
export interface IJsiiStructuralInterface extends IJsiiType {
  /**
   * The properties of the structural interface
   */
  readonly properties: IJsiiProperty[];
}

/**
 * Represents a JsiiStructuralInterface constructor properties
 */
export interface JsiiStructuralInterfaceProps extends JsiiTypeProps {
  /**
   * The properties of the structural interface
   */
  readonly properties: IJsiiProperty[];
}

/**
 * Represents a JSII struct (structural interface) type
 */
export class JsiiStructuralInterface
  extends JsiiType
  implements IJsiiStructuralInterface
{
  public readonly properties: IJsiiProperty[];

  constructor(props: JsiiStructuralInterfaceProps) {
    super(props);
    this.properties = props.properties;
  }

  public toJsiiTypeDefinition(): string {
    const typeContents: string[] = [];

    typeContents.push(`export interface ${this.name} {`);

    if (this.properties) {
      typeContents.push(
        ...this.properties.map((p) => `${p.toJsiiPropertyDefinitionString()};`),
      );
    }

    typeContents.push("}");
    return typeContents.join("\n");
  }
}
