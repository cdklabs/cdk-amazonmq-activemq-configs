/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IXsdAttributeProperty } from "./xsd-attribute-property";
import { IXsdElementProperty } from "./xsd-element-property";
import { IXsdType, XsdType, XsdTypeProps } from "./xsd-type";

export interface IXsdContainerType extends IXsdType {
  readonly attributes?: IXsdAttributeProperty[];
  readonly elements?: IXsdElementProperty[];
}

export interface XsdContainerTypeProps extends XsdTypeProps {
  readonly attributes?: IXsdAttributeProperty[];
  readonly elements?: IXsdElementProperty[];
}

export abstract class XsdContainerType
  extends XsdType
  implements IXsdContainerType
{
  public readonly attributes?: IXsdAttributeProperty[];
  public readonly elements?: IXsdElementProperty[];

  constructor(props: XsdContainerTypeProps) {
    super(props);
    this.attributes = props.attributes;
    this.elements = props.elements;
  }
}
