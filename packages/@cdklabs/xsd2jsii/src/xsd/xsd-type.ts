/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IType } from "../type";

export interface IXsdType extends IType {
  readonly name: string;
}

export interface XsdTypeProps {
  readonly name: string;
}

export abstract class XsdType implements IXsdType {
  public readonly name: string;

  constructor(props: XsdTypeProps) {
    this.name = props.name;
  }
}
