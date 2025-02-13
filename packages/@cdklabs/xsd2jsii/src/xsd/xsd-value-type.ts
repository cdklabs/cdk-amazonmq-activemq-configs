/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IXsdType, XsdType, XsdTypeProps } from "./xsd-type";

export interface IXsdValueType extends IXsdType {}

export interface XsdValueTypeProps extends XsdTypeProps {}

export abstract class XsdValueType extends XsdType {}
