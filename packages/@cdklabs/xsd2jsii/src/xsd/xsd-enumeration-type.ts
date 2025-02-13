/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import {
  IXsdSimpleType,
  XsdSimpleType,
  XsdSimpleTypeProps,
} from "./xsd-simple-type";

export interface IXsdEnumerationType extends IXsdSimpleType {
  readonly values: string[];
}

export interface XsdEnumerationTypeProps extends XsdSimpleTypeProps {
  readonly values: string[];
}

export class XsdEnumerationType
  extends XsdSimpleType
  implements IXsdEnumerationType
{
  public readonly values: string[];

  constructor(props: XsdEnumerationTypeProps) {
    super(props);
    this.values = props.values;
  }
}
