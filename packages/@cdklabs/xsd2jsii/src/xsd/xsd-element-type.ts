/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import {
  IXsdContainerType,
  XsdContainerType,
  XsdContainerTypeProps,
} from "./xsd-container-type";

export interface IXsdElementType extends IXsdContainerType {
  readonly namespace?: string;
  readonly instanceof?: string;
}

export interface XsdElementTypeProps extends XsdContainerTypeProps {
  readonly namespace?: string;
  readonly instanceof?: string;
}

export class XsdElementType
  extends XsdContainerType
  implements IXsdElementType
{
  readonly namespace?: string;
  public readonly instanceof?: string;

  constructor(props: XsdElementTypeProps) {
    super(props);
    this.instanceof = props.instanceof;
    this.namespace = props.namespace;
  }
}
