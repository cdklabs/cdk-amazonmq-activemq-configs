import { XmlNode } from "../src/xml-node";

describe("XmlNode", () => {
  it("should create an instance", () => {
    expect(new XmlNode({})).toBeTruthy();
  });
});
