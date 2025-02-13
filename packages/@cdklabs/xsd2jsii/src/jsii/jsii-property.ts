/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

/**
 * Represents a single property of any JSII constructor props
 */
export interface IJsiiProperty {
  /**
   * The name of the property
   */
  readonly name: string;

  /**
   * The (single instance) type of the property
   */
  readonly typeName: string;

  /**
   * Whether the property is an array or not
   */
  readonly isArray: boolean;

  /**
   * Whether the property is optional or not
   */
  readonly isOptional: boolean;

  /**
   * Converts the property into a string that can be used in a JSII type interface
   */
  toJsiiPropertyDefinitionString(): string;
}

/**
 * Constructor properties of the JsiiProperty
 */
export interface JsiiPropertyProps {
  /**
   * The name of the property
   */
  readonly name: string;
  /**
   * The (single instance) type of the property
   */
  readonly typeName: string;
  /**
   * Whether the property is an array or not
   */
  readonly isArray: boolean;
  /**
   * Whether the property is optional or not
   */
  readonly isOptional: boolean;
}

/**
 * Represents a single property of any JSII constructor props
 */
export class JsiiProperty implements IJsiiProperty {
  readonly name: string;
  readonly typeName: string;
  readonly isArray: boolean;
  readonly isOptional: boolean;

  constructor(props: JsiiPropertyProps) {
    this.name = props.name;
    this.typeName = props.typeName;
    this.isArray = props.isArray;
    this.isOptional = props.isOptional;
  }

  toJsiiPropertyDefinitionString(): string {
    return `readonly ${this.name}${this.isOptional ? "?" : ""}: ${this.typeName}${this.isArray ? "[]" : ""}`;
  }
}
