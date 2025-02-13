/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import path from "path";
import {
  defaultCapitalize,
  defaultConvertType,
  defaultSingularize,
} from "./internal/xsd-to-jsii-type-system-converter-defaults";
import { JsiiBehavioralInterface } from "./jsii/jsii-behavioral-interface";
import { JsiiClass } from "./jsii/jsii-class";
import { JsiiEnum } from "./jsii/jsii-enum";
import { IJsiiProperty, JsiiProperty } from "./jsii/jsii-property";
import { JsiiStructuralInterface } from "./jsii/jsii-structural-interface";
import { IJsiiType } from "./jsii/jsii-type";
import { IJsiiTypeSystemPatch, JsiiTypeSystem } from "./jsii/jsii-type-system";
import { ITypeSystemConverter } from "./type-system-converter";
import { XsdComplexType } from "./xsd/xsd-complex-type";
import { XsdElementType } from "./xsd/xsd-element-type";
import { XsdEnumerationType } from "./xsd/xsd-enumeration-type";
import { IXsdType } from "./xsd/xsd-type";
import { IXsdTypeSystemPatch, XsdTypeSystem } from "./xsd/xsd-type-system";
import { XsdJsiiProperty } from "./xsd-jsii-property";

/**
 * The configurable properties of the XsdToJsiiTypeSystemConverter
 * @experimental
 */
export interface XsdToJsiiTypeSystemConverterProps {
  /**
   * Sets the file path of the XmlNode.ts class relative to where the
   * JSII-compatible classes will be generated.
   */
  readonly xmlNodeFileRelativePath?: string;

  /**
   * Sets the override map for the generated JSII-class property names.
   * The original names will be used when synthesyzing the XML file.
   */
  readonly propertyNameOverrides?: Map<string, string>;

  /**
   * Sets the additional JSII-class properties.
   */
  readonly typeAttributePropertyOverrides?: Map<string, JsiiProperty[]>;

  /**
   * Sets a function to convert from xsdTypeName to JSII-type name
   * @param xsdTypeName the type name to convert from
   * @param types the XSD types from which the conversion takes place
   * @returns a JSII-type name
   */
  readonly convertType?: (xsdTypeName: string, types: IXsdType[]) => string;

  /**
   * Sets a function to perform name capitalization
   *
   * NOTE: maybe we need to change the name to generateName?
   * @param name the XSD-type name to capitalize
   * @returns the capitalized name that will be the JSII-type name
   */
  readonly capitalize?: (name: string) => string;

  /**
   * Sets a function to singularize any plural name.
   */
  readonly singularize?: (pluralized: string) => string;

  /**
   * Sets a function to generate the attributes type name generated for the JSII-class
   * @param name the name of the JSII-class for which the attributes are generated
   * @returns a name for the JSII-type representing the set of attributes
   */
  readonly generateAttributesTypeName?: (name: string) => string;

  /**
   * Sets a function to generate the elements type name generated for the JSII-class
   * @param name the name of the JSII-class for which the elements are generated
   * @returns a name for the JSII-type representing the set of elements
   */
  readonly generateElementsTypeName?: (name: string) => string;

  /**
   * Sets a function to generate names of JSII behavioral interfaces for JSII-class
   * element properties that have multiple assignable types.
   * @param typeName the name of the XSD-type which element property has multiple assignable types
   * @param propertyName the name of the XSD-type element property that has multiple assignable types
   * @returns the name of the behavioral interface that will be generated for the element property with multiple assignable types
   */
  readonly generateAssignableTypeName?: (
    typeName: string,
    propertyName: string,
  ) => string;
}

/**
 * Implements a conversion between the XsdTypeSystem and the JsiiTypeSystem.
 * @experimental
 */
export class XsdToJsiiTypeSystemConverter
  implements
    ITypeSystemConverter<
      IXsdType,
      IXsdTypeSystemPatch,
      XsdTypeSystem,
      IJsiiType,
      IJsiiTypeSystemPatch,
      JsiiTypeSystem
    >
{
  private readonly xmlNodeFileRelativePath: string;
  private readonly relativePath: (from: string, to: string) => string;
  private readonly propertyOverrides: Map<string, string>;
  private readonly typeAttributePropertyOverrides: Map<string, JsiiProperty[]>;
  private readonly convertType: (
    xsdTypeName: string,
    types: IXsdType[],
  ) => string;
  private readonly capitalize: (name: string) => string;
  private readonly singularize: (pluralized: string) => string;
  private readonly generateAttributesTypeName: (typeName: string) => string;
  private readonly generateElementsTypeName: (typeName: string) => string;
  private readonly generateAssignableTypeName: (
    typeName: string,
    propertyName: string,
  ) => string;

  /**
   * Instantiates an XsdToJsiiTypeSystemConverter.
   * @param props an instance of XsdToJsiiTypeSystemConverterProps
   */
  constructor(readonly props: XsdToJsiiTypeSystemConverterProps) {
    this.xmlNodeFileRelativePath = props.xmlNodeFileRelativePath ?? ".";
    this.propertyOverrides = new Map<string, string>(
      props.propertyNameOverrides,
    );
    this.typeAttributePropertyOverrides = new Map<string, JsiiProperty[]>(
      props.typeAttributePropertyOverrides,
    );
    this.convertType = props.convertType ?? defaultConvertType;
    this.capitalize = props.capitalize ?? defaultCapitalize;
    this.singularize = props.singularize ?? defaultSingularize;
    this.generateAttributesTypeName = props.generateAttributesTypeName
      ? props.generateAttributesTypeName
      : (name: string) => `${this.capitalize(name)}Attributes`;
    this.generateElementsTypeName = props.generateElementsTypeName
      ? props.generateElementsTypeName
      : (name: string) => `${this.capitalize(name)}Elements`;
    this.generateAssignableTypeName = props.generateAssignableTypeName
      ? props.generateAssignableTypeName
      : (typeName: string, propertyName: string) =>
          `I${this.capitalize(typeName)}${this.capitalize(
            this.singularize(propertyName),
          )}`;
    this.relativePath = (from: string, to: string) => {
      const doesNotStartWithDot = /^[^\.]/;
      const relativePath = path.posix.relative(from, to);
      if (doesNotStartWithDot.test(relativePath)) {
        return `./${relativePath}`;
      }
      return relativePath;
    };
  }

  convert(xsdTypeSystem: XsdTypeSystem): JsiiTypeSystem {
    const jsiiTypes: IJsiiType[] = [];
    const jsiiAutoGeneratedInterfaceWithImplementers: {
      [key: string]: string[];
    } = {};

    // Step 1: process enumerations
    for (const xsdEnumType of xsdTypeSystem.types.filter(
      (t) => t instanceof XsdEnumerationType,
    )) {
      jsiiTypes.push(
        new JsiiEnum({
          name: this.capitalize(xsdEnumType.name),
          enuemration: xsdEnumType.values.reduce(
            (acc, curr) => {
              acc[curr.toUpperCase()] = curr;
              return acc;
            },
            {} as { [key: string]: string },
          ),
        }),
      );
    }

    // Step 2: process complex types
    for (const xsdElementType of xsdTypeSystem.types.filter(
      (t) => t instanceof XsdComplexType,
    )) {
      // 2.2 build attributes JSII property if the XSD element has attributes
      const attributesStruct = this.buildAttributesStruct(
        xsdElementType,
        xsdTypeSystem,
        jsiiTypes,
        this.propertyOverrides,
      );

      // 2.3 build elements JSII property if the XSD element has sub-elements
      const elementsStruct = this.buildElementsStruct(
        xsdElementType,
        xsdTypeSystem,
        jsiiAutoGeneratedInterfaceWithImplementers,
        jsiiTypes,
        this.propertyOverrides,
      );

      // 2.4 prepare the properties property for the JSII main class
      //     attributes will be the first property (if it exists)
      //     elements will be the last property (if it exists)
      const properties: IJsiiProperty[] = [];

      if (attributesStruct) {
        // 2.5 if the attributes structural interface is successfully generated
        //     we add an `attributes` property and assign it the type of attributesStruct
        properties.push(
          new JsiiProperty({
            name: "attributes",
            typeName: attributesStruct.name,
            isOptional:
              attributesStruct.properties.every((p) => p.isOptional) &&
              // INFO: if elements is not going to be optional then attributes, being the first parameter, also cannot be optional
              (elementsStruct
                ? elementsStruct.properties.every((p) => p.isOptional)
                : true),
            isArray: false,
          }),
        );
      }

      if (elementsStruct) {
        // 2.5 if the elements structural interface is successfully generated
        //     we add an `elements` property and assign it the type of elementsStruct
        properties.push(
          new JsiiProperty({
            name: "elements",
            typeName: elementsStruct.name,
            isOptional: elementsStruct.properties.every((e) => e.isOptional),
            isArray: false,
          }),
        );
      }

      const tagNameProperty = new JsiiProperty({
        name: "tagName",
        typeName: "string",
        isOptional: true,
        isArray: false,
      });

      properties.push(tagNameProperty);

      // 2.6 having properties generated we build the main class
      jsiiTypes.push(
        new JsiiClass({
          name: this.capitalize(xsdElementType.name),
          properties: properties.length > 0 ? properties : undefined,
          // 2.7 for now we allow only for deriving from XmlNode.
          // It most likely will remain that for XSD Element Types
          // but it needs to be identified for when we have XSD Complex Types included
          // As the Amazon MQ for ActiveMQ does not contain (top-level) XSD Complex Types
          // there was no need for adding them.
          extends: {
            class: "XmlNode",
            classRelativePath: this.relativePath(
              this.xmlNodeFileRelativePath,
              "./xml-node",
            ),
            superProps: {
              tagName: tagNameProperty.name,
              // INFO: this is because there are instances where the default
              //       name conversation does not work and there needs to be
              //       a custom override introduced.
              elemsNamesOverrides:
                elementsStruct &&
                elementsStruct.properties.some(
                  (e) => e instanceof XsdJsiiProperty,
                )
                  ? elementsStruct.properties
                      .filter((e) => e instanceof XsdJsiiProperty)
                      .reduce(
                        (acc, curr) => {
                          const prop = curr as XsdJsiiProperty;
                          acc[prop.name] = prop.originalName;
                          return acc;
                        },
                        {} as { [key: string]: string },
                      )
                  : undefined,
              // INFO: this is because there are instances where the default
              //       name conversation does not work and there needs to be
              //       a custom override introduced.
              attrsNamesOverrides:
                attributesStruct &&
                attributesStruct.properties.some(
                  (e) => e instanceof XsdJsiiProperty,
                )
                  ? attributesStruct.properties
                      .filter((e) => e instanceof XsdJsiiProperty)
                      .reduce(
                        (acc, curr) => {
                          const prop = curr as XsdJsiiProperty;
                          acc[prop.name] = prop.originalName;
                          return acc;
                        },
                        {} as { [key: string]: string },
                      )
                  : undefined,
            },
          },
        }),
      );
    }

    // Step 3: process elements
    for (const xsdElementType of xsdTypeSystem.types.filter(
      (t) => t instanceof XsdElementType,
    )) {
      // 3.2 build attributes JSII property if the XSD element has attributes
      const attributesStruct = this.buildAttributesStruct(
        xsdElementType,
        xsdTypeSystem,
        jsiiTypes,
        this.propertyOverrides,
      );

      // 3.3 build elements JSII property if the XSD element has sub-elements
      const elementsStruct = this.buildElementsStruct(
        xsdElementType,
        xsdTypeSystem,
        jsiiAutoGeneratedInterfaceWithImplementers,
        jsiiTypes,
        this.propertyOverrides,
      );

      // 3.4 prepare the properties property for the JSII main class
      //     attributes will be the first property (if it exists)
      //     elements will be the last property (if it exists)
      const properties: IJsiiProperty[] = [];

      if (attributesStruct) {
        // 3.5 if the attributes structural interface is successfully generated
        //     we add an `attributes` property and assign it the type of attributesStruct
        properties.push(
          new JsiiProperty({
            name: "attributes",
            typeName: attributesStruct.name,
            isOptional:
              attributesStruct.properties.every((p) => p.isOptional) &&
              // INFO: if elements is not going to be optional then attributes, being the first parameter, also cannot be optional
              (elementsStruct
                ? elementsStruct.properties.every((p) => p.isOptional)
                : true),
            isArray: false,
          }),
        );
      }

      if (elementsStruct) {
        // 3.6 if the elements structural interface is successfully generated
        //     we add an `elements` property and assign it the type of elementsStruct
        properties.push(
          new JsiiProperty({
            name: "elements",
            typeName: elementsStruct.name,
            isOptional: elementsStruct.properties.every((e) => e.isOptional),
            isArray: false,
          }),
        );
      }

      // 3.7 having properties generated we build the main class
      jsiiTypes.push(
        new JsiiClass({
          name: this.capitalize(xsdElementType.name),
          properties: properties.length > 0 ? properties : undefined,
          // 3.8 for now we allow only for deriving from XmlNode.
          // It most likely will remain that for XSD Element Types
          // but it needs to be identified for when we have XSD Complex Types included
          // As the Amazon MQ for ActiveMQ does not contain (top-level) XSD Complex Types
          // there was no need for adding them.
          extends: {
            class: "XmlNode",
            classRelativePath: this.relativePath(
              this.xmlNodeFileRelativePath,
              "./xml-node",
            ),
            superProps: {
              // TODO: make sure that this is the right approach.
              tagName: xsdElementType.name,
              namespace: xsdElementType.namespace,
              // INFO: this is because there are instances where the default
              //       name conversation does not work and there needs to be
              //       a custom override introduced.
              elemsNamesOverrides:
                elementsStruct &&
                elementsStruct.properties.some(
                  (e) => e instanceof XsdJsiiProperty,
                )
                  ? elementsStruct.properties
                      .filter((e) => e instanceof XsdJsiiProperty)
                      .reduce(
                        (acc, curr) => {
                          const prop = curr as XsdJsiiProperty;
                          acc[prop.name] = prop.originalName;
                          return acc;
                        },
                        {} as { [key: string]: string },
                      )
                  : undefined,
              // INFO: this is because there are instances where the default
              //       name conversation does not work and there needs to be
              //       a custom override introduced.
              attrsNamesOverrides:
                attributesStruct &&
                attributesStruct.properties.some(
                  (e) => e instanceof XsdJsiiProperty,
                )
                  ? attributesStruct.properties
                      .filter((e) => e instanceof XsdJsiiProperty)
                      .reduce(
                        (acc, curr) => {
                          const prop = curr as XsdJsiiProperty;
                          acc[prop.name] = prop.originalName;
                          return acc;
                        },
                        {} as { [key: string]: string },
                      )
                  : undefined,
            },
          },
        }),
      );
    }

    // Step 4: populate jsiiClass.implements array with interfaces autogenerated in Step 2
    jsiiTypes
      .filter((t) => t instanceof JsiiClass)
      .forEach((jsiiClass) => {
        this.appendInterfaces(
          jsiiClass,
          jsiiAutoGeneratedInterfaceWithImplementers,
          jsiiTypes,
        );
      });

    return new JsiiTypeSystem(jsiiTypes);
  }

  private appendInterfaces(
    jsiiClass: JsiiClass,
    jsiiAutoGeneratedInterfaceWithImplementers: { [key: string]: string[] },
    jsiiTypes: IJsiiType[],
  ) {
    // 1 Retrieve all the interfaceNames that jsiiClass is to implement
    const interfaceNames = Object.entries(
      jsiiAutoGeneratedInterfaceWithImplementers,
    )
      .filter(([_, impls]) => impls.includes(jsiiClass.name))
      .map(([infc, _]) => infc);

    // 2 Once we have the interface names and the list is non-empty
    if (interfaceNames.length > 0) {
      // 3 First we collect these interfaces that ended up being in the jsiiTypes...
      const interfaces = jsiiTypes
        .filter((t) => interfaceNames.includes(t.name))
        .map((t) => t.name);
      // 4 ...and push them as the interfaces that the jsiiClass is expected to implement
      jsiiClass.implements?.push(...interfaces.sort());
    }
  }

  private buildElementsStruct(
    xsdElementType: XsdElementType,
    xsdTypeSystem: XsdTypeSystem,
    jsiiInterfaceWithImplementers: { [key: string]: string[] },
    jsiiTypes: IJsiiType[],
    propertyOverrides: Map<string, string>,
  ) {
    if (xsdElementType.elements) {
      const jsiiElemTypeName = this.generateElementsTypeName(
        xsdElementType.name,
      );

      const elements = new JsiiStructuralInterface({
        name: jsiiElemTypeName,
        properties: xsdElementType.elements.map((xsdElemProp) => {
          const isArray =
            typeof xsdElemProp.maxOccurs === "string" &&
            xsdElemProp.maxOccurs === "unbounded";
          const isOptional = xsdElemProp.minOccurs === 0;

          let typeName: string = "";

          if (xsdElemProp.assignableTypeNames.length == 1) {
            // if there is only one assignable type - we're not generating any behavioral interfaces
            // and just using this type as the type to be expected by the property.
            typeName = this.convertType(
              xsdElemProp.assignableTypeNames[0],
              xsdTypeSystem.types,
            );
          } else {
            // otherwise we have multiple assigned items: we need to create a bahavioral interface

            // 1. We're generating a name for the type.
            typeName = this.generateAssignableTypeName(
              xsdElementType.name,
              xsdElemProp.name,
            );

            // 2. we're putting the generated type name to the bag of all auto-generated JSII behavioral interfaces
            //    and add all the assignable types as its implementers. Later, we'll use it to update the types' `implements` properties
            //    We're doing it this way, as there is a chance that some of the types do not exist now
            //    so we'll add them as post-process
            jsiiInterfaceWithImplementers[typeName] =
              xsdElemProp.assignableTypeNames.map((atn) =>
                this.convertType(atn, xsdTypeSystem.types),
              );

            // 3. And finally we're putting this interface to the jsiiTypes
            jsiiTypes.push(
              new JsiiBehavioralInterface({
                name: typeName,
              }),
            );
          }

          // TODO: move it to
          if (propertyOverrides.has(xsdElemProp.name)) {
            return new XsdJsiiProperty({
              name: propertyOverrides.get(xsdElemProp.name)!,
              isArray: isArray,
              isOptional: isOptional,
              typeName,
              originalName: xsdElemProp.name,
            });
          }

          return new JsiiProperty({
            name: xsdElemProp.name,
            isArray: isArray,
            isOptional: isOptional,
            typeName,
          });
        }),
      });

      jsiiTypes.push(elements);

      return elements;
    }
    return undefined;
  }

  private buildAttributesStruct(
    xsdType: XsdElementType,
    xsdTypeSystem: XsdTypeSystem,
    jsiiTypes: IJsiiType[],
    propertyOverrides: Map<string, string>,
  ): JsiiStructuralInterface | undefined {
    if (xsdType.attributes) {
      const jsiiAttributesTypeName = this.generateAttributesTypeName(
        xsdType.name,
      );

      const attributes = new JsiiStructuralInterface({
        name: jsiiAttributesTypeName,
        properties: xsdType.attributes.map((xsdAttr) => {
          if (propertyOverrides.has(xsdAttr.name)) {
            return new XsdJsiiProperty({
              name: propertyOverrides.get(xsdAttr.name)!,
              isArray: false,
              isOptional: xsdAttr.use === "optional",
              typeName: this.convertType(xsdAttr.typeName, xsdTypeSystem.types),
              originalName: xsdAttr.name,
            });
          }

          return new JsiiProperty({
            name: xsdAttr.name,
            isArray: false,
            isOptional: xsdAttr.use === "optional",
            typeName: this.convertType(xsdAttr.typeName, xsdTypeSystem.types),
          });
        }),
      });

      if (
        this.typeAttributePropertyOverrides.has(this.capitalize(xsdType.name))
      ) {
        attributes.properties.push(
          ...this.typeAttributePropertyOverrides.get(
            this.capitalize(xsdType.name),
          )!,
        );
      }

      jsiiTypes.push(attributes);

      return attributes;
    }

    return undefined;
  }
}
