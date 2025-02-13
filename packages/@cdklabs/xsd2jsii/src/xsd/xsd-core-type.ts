/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import {
  IXsdValueType,
  XsdValueType,
  XsdValueTypeProps,
} from "./xsd-value-type";

export interface IXsdCoreType extends IXsdValueType {}

export interface XsdCoreTypeProps extends XsdValueTypeProps {}

export class XsdCoreType extends XsdValueType implements IXsdValueType {
  constructor(props: XsdCoreTypeProps) {
    super(props);
  }
}
