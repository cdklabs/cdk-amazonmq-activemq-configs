/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import * as JSON5 from "json5";
import { IJsiiProperty } from "./jsii-property";
import { IJsiiType, JsiiType, JsiiTypeProps } from "./jsii-type";

/**
 * Represents a JSII class type
 */
export interface IJsiiClass extends IJsiiType {
  /**
   * A list of properties for the class constructor
   */
  readonly properties?: IJsiiProperty[];

  /**
   * An optional JSII class that this class extends
   */
  readonly extends?: JsiiClassExtendsProperty;

  /**
   * Optional array of interfaces that this class implements
   */
  readonly implements: string[];
}

export interface JsiiClassExtendsProperty {
  readonly class: string; // TODO: how to nicely create a super?
  readonly superProps: { [key: string]: any };
  readonly classRelativePath: string;
}

/**
 * Represents a JsiiClass constructor properties
 */
export interface JsiiClassProps extends JsiiTypeProps {
  /**
   * A list of properties for the class constructor
   */
  readonly properties?: IJsiiProperty[];
  /**
   * An optional JSII class that this class extends
   */
  readonly extends?: JsiiClassExtendsProperty;

  /**
   * Optional array of interfaces that this class implements
   */
  readonly implements?: string[];
}

/**
 * Represents a JSII class type
 */
export class JsiiClass extends JsiiType implements IJsiiClass {
  readonly properties?: IJsiiProperty[];
  readonly extends?: JsiiClassExtendsProperty;
  readonly implements: string[];

  constructor(props: JsiiClassProps) {
    super(props);
    this.properties = props.properties;
    this.extends = props.extends;
    this.implements = props.implements ?? [];
  }

  public toJsiiTypeDefinition(): string {
    const typeContents: string[] = [];

    typeContents.push(`export class ${this.name}`);
    if (this.extends) {
      typeContents.push(`extends ${this.extends.class}`);
    }

    if (this.implements.length > 0) {
      typeContents.push("implements");
      typeContents.push(this.implements.map((i) => `${i}`).join(",\n"));
    }

    typeContents.push("{");

    if (this.properties) {
      typeContents.push("constructor(");
      typeContents.push(
        ...this.properties.map(
          (p) => `public ${p.toJsiiPropertyDefinitionString()},`,
        ),
      );
      typeContents.push(") {");
      if (this.extends) {
        typeContents.push(
          `super(${JSON5.stringify(this.extends.superProps, null, " ")});`,
        );
      }
      typeContents.push("}");
    } else if (this.extends) {
      typeContents.push("constructor() {");
      typeContents.push(
        `super(${JSON5.stringify(this.extends.superProps, null, " ")});`,
      );
      typeContents.push("}");
    }

    typeContents.push("}");

    return typeContents.join("\n");
  }
}
