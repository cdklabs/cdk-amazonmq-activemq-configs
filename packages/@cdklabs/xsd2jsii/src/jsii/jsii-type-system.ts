/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { ITypeSystem, ITypeSystemPatch } from "../type-system";
import { IJsiiType } from "./jsii-type";

export interface IJsiiTypeSystemPatch extends ITypeSystemPatch<IJsiiType> {
  patch(rawTypes: IJsiiType[]): void;
}

export class JsiiTypeSystem
  implements ITypeSystem<IJsiiType, IJsiiTypeSystemPatch>
{
  constructor(public readonly types: IJsiiType[]) {}

  patch(typeSystemPatch: IJsiiTypeSystemPatch): void {
    typeSystemPatch.patch(this.types);
  }
}
