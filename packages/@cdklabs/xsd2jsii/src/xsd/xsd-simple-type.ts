/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import {
  IXsdValueType,
  XsdValueType,
  XsdValueTypeProps,
} from "./xsd-value-type";

export interface IXsdSimpleType extends IXsdValueType {
  readonly baseType: string;
}

export interface XsdSimpleTypeProps extends XsdValueTypeProps {
  readonly baseType: string;
}

export class XsdSimpleType extends XsdValueType implements IXsdSimpleType {
  public readonly baseType: string;

  constructor(props: XsdSimpleTypeProps) {
    super(props);
    this.baseType = props.baseType;
  }
}
