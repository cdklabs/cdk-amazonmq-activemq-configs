import fs from "fs";
import path from "path";
import {
  XsdComplexType,
  XsdElementType,
  XsdEnumerationType,
  XsdTypeSystemBuilder,
} from "../../src";

describe("xsd-type-system-builder", () => {
  it("shiporder.xsd resolves correctly", async () => {
    const schema = fs.readFileSync(
      path.join(__dirname, "..", "data/shiporder.xsd"),
      "utf-8",
    );

    const builder = new XsdTypeSystemBuilder(schema);

    const system = await builder.build();

    expect(system.types).toHaveLength(9);

    const shiporder = system.types.find((t) => t.name === "shiporder");
    expect(shiporder).toBeDefined();
    // This is a top-level element, and needs to have tag (i.e. needs to be a proper element)
    expect(shiporder).toBeInstanceOf(XsdElementType);

    const item = system.types.find((t) => t.name === "item");
    expect(item).toBeDefined();
    expect(item).toBeInstanceOf(XsdElementType);

    const shipto = system.types.find((t) => t.name === "shipto");
    expect(shipto).toBeDefined();
    expect(shipto).toBeInstanceOf(XsdElementType);

    const orderperson = system.types.find((t) => t.name === "orderperson");
    expect(orderperson).toBeUndefined();
  });

  it("PurchaseOrder.xsd resolves correctly", async () => {
    const schema = fs.readFileSync(
      path.join(__dirname, "..", "data/PurchaseOrder.xsd"),
      "utf-8",
    );

    const builder = new XsdTypeSystemBuilder(schema);

    const system = await builder.build();

    expect(system.types).toHaveLength(9);

    const purchaseOrder = system.types.find((t) => t.name === "PurchaseOrder");
    expect(purchaseOrder).toBeDefined();
    expect(purchaseOrder).toBeInstanceOf(XsdElementType);

    const purchaseOrderType = system.types.find(
      (t) => t.name === "PurchaseOrderType",
    );
    expect(purchaseOrderType).toBeDefined();
    expect(purchaseOrderType).toBeInstanceOf(XsdComplexType);
  });

  it("amazon-mq-active-mq-5.18.4.xsd resolves correctly", async () => {
    const schema = fs.readFileSync(
      path.join(__dirname, "..", "data/amazon-mq-active-mq-5.18.4.xsd"),
      "utf-8",
    );

    const builder = new XsdTypeSystemBuilder(schema);

    const system = await builder.build();

    expect(system.types).toHaveLength(76);

    const allComplexTypes = system.types.filter(
      (t) => t instanceof XsdComplexType,
    );

    // The file contains only anonymous types
    expect(allComplexTypes).toHaveLength(0);

    const allElementTypes = system.types.filter(
      (t) => t instanceof XsdElementType,
    );

    expect(allElementTypes).toHaveLength(64);

    const allEnumerationTypes = system.types.filter(
      (t) => t instanceof XsdEnumerationType,
    );

    // The file contains three fields for which there are fixed string values allowed
    expect(allEnumerationTypes).toHaveLength(3);

    expect(allEnumerationTypes).toContainEqual(
      expect.objectContaining({
        name: "preallocationStrategy",
        values: ["sparse_file", "os_kernel_copy", "zeros"],
      }),
    );

    expect(allEnumerationTypes).toContainEqual(
      expect.objectContaining({
        name: "journalDiskSyncStrategy",
        values: ["always", "periodic", "never"],
      }),
    );

    expect(allEnumerationTypes).toContainEqual(
      expect.objectContaining({
        name: "protocol",
        values: ["openwire"],
      }),
    );
  });
});
