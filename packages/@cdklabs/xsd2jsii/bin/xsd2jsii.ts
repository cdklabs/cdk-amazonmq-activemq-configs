/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import * as fs from "fs";
import path from "path";
import { JsiiClass } from "../src/jsii/jsii-class";
import { JsiiProperty } from "../src/jsii/jsii-property";
import { XsdElementType } from "../src/xsd/xsd-element-type";
import {
  XsdElementPropertyAssignableTypePatch,
  XsdTypePatch,
} from "../src/xsd/xsd-type-system";
import { XsdTypeSystemBuilder } from "../src/xsd/xsd-type-system-builder";
import { XsdToJsiiTypeSystemConverter } from "../src/xsd-to-jsii-type-system-converter";

async function main() {
  const schemaFilePath = process.argv[2];
  const schemaFileFullPath = path.join(".", schemaFilePath);
  const schema = fs.readFileSync(schemaFileFullPath, "utf8");
  const builder = new XsdTypeSystemBuilder(schema);

  const xsdSystem = await builder.build();

  // TODO: move it outside of here as a configuration definition!
  const cachedLDAPAuthorizationMap = new XsdElementType({
    name: "cachedLDAPAuthorizationMap",
    attributes: [
      {
        name: "queueSearchBase",
        typeName: "xs:string",
        use: "optional",
      },
      {
        name: "topicSearchBase",
        typeName: "xs:string",
        use: "optional",
      },
      {
        name: "tempSearchBase",
        typeName: "xs:string",
        use: "optional",
      },
      {
        name: "refreshInterval",
        typeName: "xs:integer",
        use: "optional",
      },
      {
        name: "legacyGroupMapping",
        typeName: "xs:boolean",
        use: "optional",
      },
    ],
  });

  xsdSystem.patch(new XsdTypePatch(cachedLDAPAuthorizationMap));
  xsdSystem.patch(
    new XsdElementPropertyAssignableTypePatch(
      "authorizationPlugin",
      "map",
      cachedLDAPAuthorizationMap.name,
    ),
  );

  const converter = new XsdToJsiiTypeSystemConverter({
    // TODO: this should go as ConversionPatch
    propertyNameOverrides: new Map<string, string>([
      // JSII does not allow this
      ["map", "authorizationMap"],
      // JSII does not allow this
      ["DLQ", "dlq"],
    ]),
    // TODO: think if this should be here, or on the JsiiTypeSystem as patch
    typeAttributePropertyOverrides: new Map<string, JsiiProperty[]>([
      [
        "Broker",
        [
          new JsiiProperty({
            name: "start",
            typeName: "boolean",
            isOptional: true,
            isArray: false,
          }),
        ],
      ],
    ]),
  });

  const jsiiSystem = converter.convert(xsdSystem);

  // TODO: this should go to the jsiiSystem;
  const typeImports: { [key: string]: string[] } = {};

  jsiiSystem.types
    .filter((t) => t instanceof JsiiClass)
    .forEach((t) => {
      const tc = t as JsiiClass;

      if (!tc.extends) {
        return;
      }

      if (!(tc.extends.classRelativePath in typeImports)) {
        typeImports[tc.extends.classRelativePath] = [];
      }
      if (
        !typeImports[tc.extends.classRelativePath].includes(tc.extends.class)
      ) {
        typeImports[tc.extends.classRelativePath].push(tc.extends.class);
      }
    });

  Object.entries(typeImports).forEach(([relativePath, classNames]) => {
    console.log(`import { ${classNames.join(",")} } from '${relativePath}';\n`);
  });

  console.log(
    jsiiSystem.types.map((t) => t.toJsiiTypeDefinition()).join("\n\n"),
  );

  return;
}

main().catch((e) => {
  console.error(e.stack);
  process.exit(1);
});
