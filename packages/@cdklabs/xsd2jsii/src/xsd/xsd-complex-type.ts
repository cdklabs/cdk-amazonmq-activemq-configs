/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import {
  IXsdContainerType,
  XsdContainerType,
  XsdContainerTypeProps,
} from "./xsd-container-type";

export interface IXsdComplexType extends IXsdContainerType {}

export interface XsdComplexTypeProps extends XsdContainerTypeProps {}

export class XsdComplexType
  extends XsdContainerType
  implements IXsdComplexType
{
  constructor(props: XsdComplexTypeProps) {
    super(props);
  }
}
