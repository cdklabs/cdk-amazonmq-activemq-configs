/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IXsdProperty, XsdProperty, XsdPropertyProps } from "./xsd-property";

/**
 * Represents an XSD property, that is an element of an XSD complex type.
 */
export interface IXsdElementProperty extends IXsdProperty {
  /**
   * A minimal number of occurrences of the property inside the containing element
   *
   * @default 1 - single occurrence
   */
  readonly minOccurs: number;

  /**
   * A maximal number of occurrence of the property inside the containing element
   *
   * @default 1 - single occurrence
   */
  readonly maxOccurs: number | string;

  /**
   * The types that can be assigned to this property
   */
  readonly assignableTypeNames: string[];
}

export interface XsdElementPropertyProps extends XsdPropertyProps {
  readonly minOccurs?: number;
  readonly maxOccurs?: number | "unbounded";
  readonly assignableTypeNames: string[];
}

export class XsdElementProperty
  extends XsdProperty
  implements IXsdElementProperty
{
  public readonly minOccurs: number;
  public readonly maxOccurs: number | string;
  public readonly assignableTypeNames: string[];

  constructor(props: XsdElementPropertyProps) {
    super(props);
    this.minOccurs = props.minOccurs === undefined ? 1 : props.minOccurs;
    this.maxOccurs = props.maxOccurs === undefined ? 1 : props.maxOccurs;
    this.assignableTypeNames = props.assignableTypeNames;
  }
}
