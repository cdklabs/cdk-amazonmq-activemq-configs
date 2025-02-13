/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import * as xml2js from "xml2js";
import { XsdAttributeProperty } from "./xsd-attribute-property";
import { XsdComplexType } from "./xsd-complex-type";
import { XsdCoreType } from "./xsd-core-type";
import { XsdElementProperty } from "./xsd-element-property";
import { XsdElementType } from "./xsd-element-type";
import { XsdEnumerationType } from "./xsd-enumeration-type";
import { XsdSimpleType } from "./xsd-simple-type";
import { IXsdType } from "./xsd-type";
import { XsdTypeSystem } from "./xsd-type-system";

const DEFAULT_XSD_NAMESPACE_PREFIX = "xs";

export interface XmlAttributeDescription {
  name: string;
  type: {
    name: string;
    schemaName?: string;
  };
  use?: "optional" | "required";
}

export interface XmlElementDescription {
  name: string;
  minOccurs?: string | number;
  maxOccurs?: string | number;
  isUnknown?: boolean; // TODO: this is sequence that is a tagless container
  assignableSchemaTypes?: string[];
}

export interface XmlTypeDescription {
  tns?: string;
  noEmit?: boolean;
  /**
   * Specifies whether is an instance of a complex type
   */
  instanceof: string;
  schemaName: string;
  name: string;
  complexType?: boolean;
  isSequence?: boolean;
  container?: {
    attributes?: XmlAttributeDescription[];
    elements?: XmlElementDescription[];
  };
  enum?: {
    values: { [key: string]: string };
  };
}

const typePrecedenceSorter = (a: XmlTypeDescription, b: XmlTypeDescription) => {
  if (!!a.noEmit) {
    return -1;
  } else if (!!b.noEmit) {
    return 1;
  }

  if (!!a.enum) {
    return -1;
  } else if (!!b.enum) {
    return 1;
  }

  if (!a.container) {
    return -1;
  } else if (!b.container) {
    return 1;
  }

  if (a.container && !a.container.elements) {
    return -1;
  } else if (b.container && !b.container.elements) {
    return 1;
  }

  if (
    a.container &&
    a.container.elements &&
    a.container.elements.some(
      (e) =>
        e.assignableSchemaTypes &&
        e.assignableSchemaTypes.includes(b.schemaName),
    )
  ) {
    return 1;
  } else if (
    b.container &&
    b.container.elements &&
    b.container.elements.some(
      (e) =>
        e.assignableSchemaTypes &&
        e.assignableSchemaTypes.includes(a.schemaName),
    )
  ) {
    return -1;
  }

  return 0;
};

export class XsdTypeSystemBuilder {
  private readonly schema: string;
  private readonly defaultNamespace: string;
  private readonly types: IXsdType[];

  constructor(
    schema: string,
    defaultNamespace?: string,
    defaultTypes?: IXsdType[],
  ) {
    this.schema = schema;
    this.defaultNamespace =
      defaultNamespace || "http://www.w3.org/2001/XMLSchema";
    this.types = defaultTypes
      ? [...defaultTypes]
      : [
          new XsdCoreType({
            name: "xs:boolean",
          }),
          new XsdCoreType({
            name: "xs:string",
          }),
          new XsdCoreType({
            name: "xs:short",
          }),
          new XsdCoreType({
            name: "xs:integer",
          }),
          new XsdCoreType({
            name: "xs:long",
          }),
          new XsdCoreType({
            name: "xs:double",
          }),
        ];
  }

  public async build(): Promise<XsdTypeSystem> {
    const xsd = this.schema;

    const xsdNamespacePrefix =
      this.getXsdNamespacePrefix(xsd) ?? DEFAULT_XSD_NAMESPACE_PREFIX;

    const targetNamespace = this.getXsdTargetNamespace(xsd);

    const correctedxsd = (xsd as any)
      .replaceAll(`${xsdNamespacePrefix}:`, "xs:")
      .replaceAll(`:${xsdNamespacePrefix}`, ":xs");

    const parser = new xml2js.Parser();
    const schema = await parser.parseStringPromise(correctedxsd);

    const defs = this.buildXmlTypeDefinitions(schema, targetNamespace);

    const sortedDefs = defs.sort(typePrecedenceSorter);

    for (const def of sortedDefs) {
      if (def.noEmit) {
        this.types.push(
          new XsdSimpleType({
            name: def.schemaName,
            baseType: def.name,
          }),
        );
        continue;
      }

      if (def.enum) {
        this.types.push(
          new XsdEnumerationType({
            name: def.schemaName,
            baseType: "xs:string",
            values: Object.entries(def.enum.values).map(([_, value]) => value),
          }),
        );
        continue;
      }

      if (def.complexType) {
        this.types.push(
          new XsdComplexType({
            name: def.schemaName,
            attributes: def.container?.attributes?.map(
              (attr) =>
                new XsdAttributeProperty({
                  name: attr.name,
                  use: attr.use,
                  typeName: attr.type.name,
                }),
            ),
            // TODO: fix the filter! We need to create a sequence type out of it
            elements: def.container?.elements
              ?.filter((e) => !e.isUnknown)
              .map((elem) => {
                const assignableTypeNames = elem.assignableSchemaTypes;

                if (!assignableTypeNames) {
                  throw new Error("Should never be here");
                }

                return new XsdElementProperty({
                  name: elem.name,
                  maxOccurs: elem.maxOccurs
                    ? elem.maxOccurs === "unbounded"
                      ? "unbounded"
                      : parseInt(elem.maxOccurs as string)
                    : undefined,
                  minOccurs: elem.minOccurs
                    ? parseInt(elem.minOccurs as string)
                    : undefined,
                  assignableTypeNames,
                });
              }),
          }),
        );
        continue;
      }

      this.types.push(
        new XsdElementType({
          namespace: def.tns,
          name: def.schemaName,
          instanceof: def.instanceof,
          attributes: def.container?.attributes?.map(
            (attr) =>
              new XsdAttributeProperty({
                name: attr.name,
                use: attr.use,
                typeName: attr.type.name,
              }),
          ),
          // TODO: fix the filter! We need to create a sequence type out of it
          elements: def.container?.elements
            ?.filter((e) => !e.isUnknown)
            .map((elem) => {
              const assignableTypeNames = elem.assignableSchemaTypes;

              if (!assignableTypeNames) {
                throw new Error("Should never be here");
              }

              return new XsdElementProperty({
                name: elem.name,
                maxOccurs: elem.maxOccurs
                  ? elem.maxOccurs === "unbounded"
                    ? "unbounded"
                    : parseInt(elem.maxOccurs as string)
                  : undefined,
                minOccurs: elem.minOccurs
                  ? parseInt(elem.minOccurs as string)
                  : undefined,
                assignableTypeNames,
              });
            }),
        }),
      );
    }

    return new XsdTypeSystem([...this.types]);
  }

  private getXsdTargetNamespace(xsd: string) {
    const tnsName = 'targetNamespace="';
    let targetNamespaceStartPosition = xsd.indexOf(tnsName);

    if (targetNamespaceStartPosition === -1) {
      return undefined;
    }

    targetNamespaceStartPosition += tnsName.length;

    const targetNamespaceEndPosition = xsd.indexOf(
      '"',
      targetNamespaceStartPosition,
    );

    const targetNamespace = xsd.substring(
      targetNamespaceStartPosition,
      targetNamespaceEndPosition,
    );

    return targetNamespace;
  }

  private getXsdNamespacePrefix(xsd: string) {
    const prefixEndPosition = xsd.indexOf(`="${this.defaultNamespace}"`);

    if (prefixEndPosition === -1) {
      return undefined;
    }
    const xmlns_ = "xmlns:";
    const prefixStartPosition =
      xsd.substring(0, prefixEndPosition).lastIndexOf(xmlns_) + xmlns_.length;

    if (prefixStartPosition === xmlns_.length - 1) {
      return undefined;
    }

    const xsdNamespacePrefix = xsd.substring(
      prefixStartPosition,
      prefixEndPosition,
    );
    return xsdNamespacePrefix;
  }

  private processTypeElementInfo(
    elemInfo: any,
    typeDefs: XmlTypeDescription[],
  ) {
    const schemaName = elemInfo.$.name;
    const minOccurs = elemInfo.$.minOccurs;
    const maxOccurs = elemInfo.$.maxOccurs;

    if (elemInfo.$.type) {
      return {
        name: schemaName,
        maxOccurs,
        minOccurs,
        assignableSchemaTypes: [elemInfo.$.type.replace(/^tns:/, "")],
      } as XmlElementDescription;
    }

    const structure = elemInfo["xs:complexType"][0];

    const structSequence = structure["xs:sequence"];

    if (structSequence) {
      const elemsInfo = structSequence[0]["xs:element"];

      if (elemsInfo && Array.isArray(elemsInfo)) {
        const newType = this.processTopLevelElementInfo(
          elemInfo,
          typeDefs,
          true,
        );
        typeDefs.push(newType);
        return {
          name: schemaName,
          minOccurs,
          maxOccurs,
          assignableSchemaTypes: [schemaName],
        } as XmlElementDescription;
      }
    }

    let assignableSchemaTypes: string[] | undefined = undefined;

    if (!structSequence) {
      const elemsInfo = structure["xs:choice"][0]["xs:element"];

      if (elemsInfo && Array.isArray(elemsInfo)) {
        assignableSchemaTypes = elemsInfo.map((ei) =>
          ei.$.ref.replace(/^tns:/, ""),
        );
      }
    }

    return {
      name: schemaName,
      maxOccurs,
      isUnknown: !!structSequence,
      minOccurs,
      assignableSchemaTypes,
    } as XmlElementDescription;
  }

  private buildXmlTypeDefinitions(schema: any, targetNamespace?: string) {
    const typeDefinitions: XmlTypeDescription[] = [];
    const simpleTypes = schema["xs:schema"]["xs:simpleType"];

    if (simpleTypes && Array.isArray(simpleTypes)) {
      typeDefinitions.push(
        ...simpleTypes.map((typeInfo) => this.processSimpleTypeInfo(typeInfo)),
      );
    }

    const elements = schema["xs:schema"]["xs:element"];

    if (elements && Array.isArray(elements)) {
      typeDefinitions.push(
        ...elements.map((elem) =>
          this.processTopLevelElementInfo(
            elem,
            typeDefinitions,
            false,
            targetNamespace,
          ),
        ),
      );
    }

    const complexTypes = schema["xs:schema"]["xs:complexType"];

    if (complexTypes && Array.isArray(complexTypes)) {
      typeDefinitions.push(
        ...complexTypes.map((elem) =>
          this.processTopLevelComplexTypeInfo(elem, typeDefinitions),
        ),
      );
    }

    return typeDefinitions;
  }

  private processSimpleTypeInfo(simpleTypeInfo: {
    $: {
      name: string;
    };
    "xs:restriction": {
      $: {
        base: string;
      };
      "xs:enumeration":
        | {
            $: {
              value: string;
            };
          }[]
        | undefined;
    }[];
  }) {
    const schemaName: string = simpleTypeInfo.$.name;
    const schemaBaseTypeName: string =
      simpleTypeInfo["xs:restriction"][0].$.base;

    if (schemaBaseTypeName !== "xs:string") {
      // it's number so just number
      return {
        name: schemaBaseTypeName,
        schemaName,
        noEmit: true,
      } as XmlTypeDescription;
    }

    const enumeration = simpleTypeInfo["xs:restriction"][0]["xs:enumeration"];
    let valsDict: { [key: string]: string } | undefined = undefined;
    if (enumeration && Array.isArray(enumeration)) {
      valsDict = enumeration
        .map((e) => e.$.value as string)
        .reduce(
          (acc, curr) => {
            acc[curr.toUpperCase()] = curr;
            return acc;
          },
          {} as { [key: string]: string },
        );
    }

    if (valsDict) {
      return {
        name: schemaName,
        schemaName,
        enum: {
          values: valsDict,
        },
      } as XmlTypeDescription;
    }

    throw new Error(`processSimpleTypeInfo: unable to process ${schemaName}`);
  }

  private processAttrInfo(attrInfo: any, typeDefs: XmlTypeDescription[]) {
    const name: string = attrInfo.$.name;

    const simpleTypeInfo = attrInfo["xs:simpleType"];

    if (simpleTypeInfo) {
      const normalizedInfo = {
        $: attrInfo.$,
        "xs:restriction": simpleTypeInfo[0]["xs:restriction"],
      };
      const typeDef = this.processSimpleTypeInfo(normalizedInfo);
      typeDefs.push(typeDef);

      return {
        name,
        type: {
          name: typeDef.name.replace(/^tns:/, ""),
        },
        use: attrInfo.$.use,
      } as XmlAttributeDescription;
    }

    const typeName: string = attrInfo.$.type;

    return {
      name,
      type: {
        name: typeName.replace(/^tns:/, ""),
      },
      use: attrInfo.$.use,
    } as XmlAttributeDescription;
  }

  private processTopLevelElementInfo(
    elem: any,
    typeDefs: XmlTypeDescription[],
    isSequence: boolean = false,
    targetNamespace?: string,
  ) {
    const schemaName: string = elem.$.name;
    const name: string = schemaName;
    let attrs: XmlAttributeDescription[] | undefined = undefined;
    let elems: XmlElementDescription[] | undefined = undefined;

    // TODO: fix this as this means we depend on a complexType
    if (elem.$.type) {
      return {
        schemaName,
        instanceof: elem.$.type.replace(/tns:/, ""),
        tns: targetNamespace,
      } as XmlTypeDescription;
    }

    const elemInfo = elem["xs:complexType"][0];

    if (typeof elemInfo === "string") {
      // it will be an empty class without attrs and elems
      return {
        schemaName,
        name,
        tns: targetNamespace,
      } as XmlTypeDescription;
    }

    const schemaAttrs = elemInfo["xs:attribute"];

    if (schemaAttrs && Array.isArray(schemaAttrs)) {
      attrs = schemaAttrs.map((attrInfo: any) =>
        this.processAttrInfo(attrInfo, typeDefs),
      );
    }

    const schemaSequence = elemInfo["xs:sequence"];

    if (schemaSequence) {
      const schemaElems = schemaSequence[0]["xs:element"];

      if (schemaElems && Array.isArray(schemaElems)) {
        elems = schemaElems.map((ei: any) =>
          this.processTypeElementInfo(ei, typeDefs),
        );
      }
    }

    const schemaChoice = elemInfo["xs:choice"];

    if (schemaChoice) {
      // has elements. Let's investigate what kind of elems
      const choice0 = schemaChoice[0];

      const schemaElems = choice0["xs:choice"][0]["xs:element"];

      if (schemaElems && Array.isArray(schemaElems)) {
        elems = schemaElems.map((ei: any) =>
          this.processTypeElementInfo(ei, typeDefs),
        );
      } else {
        throw new Error("boom");
      }
    }

    return {
      tns: targetNamespace,
      schemaName,
      name,
      isSequence,
      container: (attrs || elems) && {
        attributes: attrs,
        elements: elems,
      },
    } as XmlTypeDescription;
  }

  private processTopLevelComplexTypeInfo(
    elem: any,
    typeDefs: XmlTypeDescription[],
  ) {
    const schemaName: string = elem.$.name;
    const name: string = schemaName;
    let attrs: XmlAttributeDescription[] | undefined = undefined;
    let elems: XmlElementDescription[] | undefined = undefined;

    // TODO: this needs correction, as this means we depend on a complexType
    if (elem.$.type) {
      // return {
      //   schemaName,
      //   name: elem.$.type.replace(/tns:/, ""),
      // } as XmlTypeDescription;
      throw new Error(
        "A complex type cannot depend directly on a complex type",
      );
    }

    const elemInfo = elem;

    if (typeof elemInfo === "string") {
      // cannot happen in a top level Complex Type
      // return {
      //   schemaName,
      //   name,
      // } as XmlTypeDescription;
      throw new Error("A Complex Type cannot be empty");
    }

    const schemaAttrs = elemInfo["xs:attribute"];

    if (schemaAttrs && Array.isArray(schemaAttrs)) {
      attrs = schemaAttrs.map((attrInfo: any) =>
        this.processAttrInfo(attrInfo, typeDefs),
      );
    }

    const schemaElems = elemInfo["xs:sequence"][0]["xs:element"];

    if (schemaElems && Array.isArray(schemaElems)) {
      elems = schemaElems.map((ei: any) =>
        this.processTypeElementInfo(ei, typeDefs),
      );
    } else {
      throw new Error("boom");
    }

    return {
      schemaName,
      name,
      container: (attrs || elems) && {
        attributes: attrs,
        elements: elems,
      },
      // TODO: think about it, but in principle top level complex types are not to be instantiated
      complexType: true,
    } as XmlTypeDescription;
  }
}
