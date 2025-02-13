import fs from "fs";
import path from "path";
import { XsdToJsiiTypeSystemConverter } from "../src";
import { XsdTypeSystemBuilder } from "../src/xsd";

describe("xsd-to-jsii-type-system-converter", () => {
  it("shiporder.xsd resolves correctly", async () => {
    const schema = fs.readFileSync(
      path.join(__dirname, "data/shiporder.xsd"),
      "utf-8",
    );

    const builder = new XsdTypeSystemBuilder(schema);

    const xsdSystem = await builder.build();

    const converter = new XsdToJsiiTypeSystemConverter({});

    const jsiiTypeSystem = converter.convert(xsdSystem);

    expect(jsiiTypeSystem.types).toHaveLength(7);
    const shipToElementsType = jsiiTypeSystem.types.find(
      (t) => t.name === "ShiptoElements",
    );

    expect(shipToElementsType).toBeDefined();
    expect(shipToElementsType?.toJsiiTypeDefinition()).toBe(
      `export interface ShiptoElements {
readonly name: string;
readonly address: string;
readonly city: string;
readonly country: string;
}`,
    );

    const shipToType = jsiiTypeSystem.types.find((t) => t.name == "Shipto");

    expect(shipToType).toBeDefined();
    expect(shipToType?.toJsiiTypeDefinition()).toBe(`export class Shipto
extends XmlNode
{
constructor(
public readonly elements: ShiptoElements,
) {
super({
 tagName: 'shipto',
});
}
}`);
  });
});
