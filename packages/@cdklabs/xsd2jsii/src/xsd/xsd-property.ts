/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

/**
 * Represents an XSD property, that is either an element, or an attribute
 * as a component of an XSD complex type.
 */
export interface IXsdProperty {
  /**
   * The name of the property
   */
  readonly name: string;
}

/**
 * A minimal set of elements that represent an XSD property.
 */
export interface XsdPropertyProps {
  /**
   * The name of the property
   */
  readonly name: string;
}

/**
 * Represents an XSD property, that is either an element, or an attribute
 * as a component of an XSD complex type.
 */
export class XsdProperty implements IXsdProperty {
  public readonly name: string;

  constructor(props: XsdPropertyProps) {
    this.name = props.name;
  }
}
