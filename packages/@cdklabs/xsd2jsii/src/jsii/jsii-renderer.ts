import { faker } from "@faker-js/faker";
import { JsiiClass } from "./jsii-class";
import { JsiiStructuralInterface } from "./jsii-structural-interface";
import { JsiiTypeSystem } from "./jsii-type-system";

export class JsiiRenderer {
  constructor(private readonly typeSystem: JsiiTypeSystem) {}

  public renderJsiiClass(type: JsiiClass) {
    const renderedBody: string[] = [];

    renderedBody.push(`new ${type.name}(`);

    type.properties
      ?.filter((structProp) => structProp.name === "attributes")
      .forEach((structProp) => {
        const propType = this.typeSystem.types.find(
          (t) => t.name === structProp.typeName,
        ) as JsiiStructuralInterface;
        if (!propType) {
          throw new Error(
            `Unable to find type ${structProp.typeName} for property ${structProp.name}`,
          );
        }
        renderedBody.push("{");
        propType.properties.forEach((prop) => {
          renderedBody.push(
            `  ${prop.name}: ${this.generateValie(prop.typeName)},`,
          );
        });
        renderedBody.push("}");
      });

    renderedBody.push(")");

    return renderedBody.join("\n");
  }

  private generateValie(typeName: string) {
    switch (typeName) {
      case "string":
        return `"${faker.string.alphanumeric()}"`;
      case "number":
        return faker.number.float();
      case "boolean":
        return faker.datatype.boolean();
      case "Protocol":
        return `Protocol.OPENWIRE`;
      case "JournalDiskSyncStrategy":
        return `JournalDiskSyncStrategy.ALWAYS`;
      case "PreallocationStrategy":
        return `PreallocationStrategy.ZEROS`;
      default:
        throw new Error(`Unable to generate value for type ${typeName}`);
    }
  }
}
