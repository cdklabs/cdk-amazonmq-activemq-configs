/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IType } from "./type";

export interface ITypeSystemPatch<TType extends IType> {
  patch(rawTypes: TType[]): void;
}

export interface ITypeSystem<
  TType extends IType,
  TTypeSystemPatch extends ITypeSystemPatch<TType>,
> {
  readonly types: TType[];
  patch(typeSystemPatch: TTypeSystemPatch): void;
}
