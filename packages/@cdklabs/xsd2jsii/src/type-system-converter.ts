/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IType } from "./type";
import { ITypeSystem, ITypeSystemPatch } from "./type-system";

export interface ITypeSystemConverter<
  TFromType extends IType,
  TFromTypeSystemPatch extends ITypeSystemPatch<TFromType>,
  TFromTypeSystem extends ITypeSystem<TFromType, TFromTypeSystemPatch>,
  TToType extends IType,
  TToTypeSystemPatch extends ITypeSystemPatch<TToType>,
  TToTypeSystem extends ITypeSystem<TToType, TToTypeSystemPatch>,
> {
  convert(typeSystem: TFromTypeSystem): TToTypeSystem;
}
