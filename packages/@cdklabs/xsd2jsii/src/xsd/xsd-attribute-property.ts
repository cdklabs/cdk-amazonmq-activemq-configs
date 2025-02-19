/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IXsdProperty, XsdProperty, XsdPropertyProps } from "./xsd-property";

/**
 * Represents an XSD property, that is an attribute of an XSD complex type
 */
export interface IXsdAttributeProperty extends IXsdProperty {
  /**
   * The type name of the attribute
   */
  readonly typeName: string;

  /**
   * The use indicator of the property
   */
  readonly use: "optional" | "required";
}

/**
 * A minimal set of elements that represent an XSD attribute property.
 */
export interface XsdAttributePropertyProps extends XsdPropertyProps {
  readonly typeName: string;
  readonly use?: "optional" | "required";
}

/**
 * Represents an XSD property, that is an attribute of an XSD complex type
 */
export class XsdAttributeProperty
  extends XsdProperty
  implements IXsdAttributeProperty
{
  public readonly typeName: string;
  public readonly use: "optional" | "required";

  constructor(props: XsdAttributePropertyProps) {
    super(props);
    this.typeName = props.typeName;
    this.use = props.use ?? "optional";
  }
}
