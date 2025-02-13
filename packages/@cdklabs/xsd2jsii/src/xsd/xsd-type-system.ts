/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { ITypeSystem } from "../type-system";
import { XsdElementProperty } from "./xsd-element-property";
import { XsdElementType } from "./xsd-element-type";
import { IXsdType } from "./xsd-type";

export interface IXsdTypeSystemPatch {
  patch(rawTypes: IXsdType[]): void;
}

export class XsdTypePatch implements IXsdTypeSystemPatch {
  constructor(private readonly newType: IXsdType) {}

  patch(rawTypes: IXsdType[]): void {
    rawTypes.push(this.newType);
  }
}

export class XsdElementPropertyAssignableTypePatch
  implements IXsdTypeSystemPatch
{
  constructor(
    public readonly elementName: string,
    public readonly propertyName: string,
    public readonly assignableTypeName: string,
  ) {}

  patch(rawTypes: IXsdType[]): void {
    const xsdElement = rawTypes.find((t) => t.name === this.elementName) as
      | XsdElementType
      | undefined;

    if (!xsdElement) {
      throw new Error(`Element ${this.elementName} not found`);
    }

    const xsdElementProperty = xsdElement.elements?.find(
      (e) => e.name === this.propertyName,
    ) as XsdElementProperty | undefined;

    if (!xsdElementProperty) {
      throw new Error(
        `Property ${this.propertyName} not found in element ${this.elementName}`,
      );
    }
    xsdElementProperty.assignableTypeNames.push(this.assignableTypeName);
  }
}

export class XsdTypeSystem
  implements ITypeSystem<IXsdType, IXsdTypeSystemPatch>
{
  public readonly types: IXsdType[];

  constructor(types: IXsdType[]) {
    this.types = types;
  }

  public patch(typeSystemPatch: IXsdTypeSystemPatch) {
    typeSystemPatch.patch(this.types);
  }
}
