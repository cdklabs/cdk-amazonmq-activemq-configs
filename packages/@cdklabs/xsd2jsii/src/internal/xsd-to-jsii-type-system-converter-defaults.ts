/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { XsdEnumerationType, XsdSimpleType } from "../xsd";
import { IXsdType } from "../xsd/xsd-type";

export const defaultCapitalize = (name: string) =>
  name[0].toUpperCase() + name.substring(1);

export const DefaultSingularizations = {
  ries$: "ry",
  cies$: "cy",
  s$: "",
};

export const defaultSingularize = (pluralized: string) => {
  const found = Object.entries(DefaultSingularizations).find(([key, _value]) =>
    new RegExp(key).test(pluralized),
  );

  if (!found) return pluralized;

  const [key, value] = found;

  return pluralized.replace(new RegExp(key), value);
};

export const defaultConvertType = (
  xsdTypeName: string,
  types: IXsdType[],
): string => {
  switch (xsdTypeName) {
    case "xs:boolean":
      return "boolean";
    case "xs:string":
      return "string";
    case "xs:short":
    case "xs:integer":
    case "xs:long":
    case "xs:double":
    case "xs:positiveInteger":
    case "xs:decimal":
      return "number";
    case "xs:date":
      return "Date";
    default:
  }

  if (types) {
    const foundType = types.find((td) => td.name === xsdTypeName);

    if (foundType instanceof XsdEnumerationType) {
      return defaultCapitalize(foundType.name);
    }

    if (foundType instanceof XsdSimpleType) {
      return defaultConvertType(foundType.baseType, types);
    }
  }

  return defaultCapitalize(xsdTypeName);
};
