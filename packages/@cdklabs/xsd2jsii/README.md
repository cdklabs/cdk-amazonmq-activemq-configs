# xsd2jsii

A TypeScript library for converting XSD schemas into JSII-compatible types, with a focus on Amazon MQ for ActiveMQ configuration support.

<!--BEGIN STABILITY BANNER-->

---

Features                                     | Stability
---------------------------------------------|--------------------------------------------------------
All types in xsd2jsii | ![Experimental](https://img.shields.io/badge/experimental-important.svg?style=for-the-badge)

**Experimental:** All types in this module are experimental and are under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## Overview

`xsd2jsii` converts XSD schemas into JSII-compatible TypeScript types. The generated types are primarily used with [@cdklabs/cdk-amazonmq](https://github.com/cdklabs/cdk-amazonmq) to create strongly-typed ActiveMQ broker configurations. While designed to support [Amazon MQ for ActiveMQ Spring XML configuration files](https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-configuration-parameters.html#working-with-spring-xml-configuration-files), the library can be adapted for other XSD schemas.

## Design Principles

### Type System Integration

The library generates types that align with the [JSII Type System](https://aws.github.io/jsii/specification/2-type-system), utilizing:
- [Classes](https://aws.github.io/jsii/specification/2-type-system/#classes)
- [Behavioral interfaces](https://aws.github.io/jsii/specification/2-type-system/#behavioral-interfaces)
- [Structs](https://aws.github.io/jsii/specification/2-type-system/#structs)
- [Enums](https://aws.github.io/jsii/specification/2-type-system/#enum)

### XSD-to-JSII-type Mapping Principles

- XSD elements and complex types are mapped to JSII classes
- attributes of an XSD type are collected into a single JSII struct
- elements of an XSD type are collected into a single JSII struct
- if a contained element can be substituted with more than one XSD type - a JSII behavioral interface is introduced as the element's type and all the XSD types that are allowed shall implement it
- XSD restriction types of strings are represented as JSII enums

### Naming Conventions

Generated code follows these conventions:
- Classes use PascalCase
- Properties use camelCase
- Attribute collections are suffixed with `Attributes`
- Element collections are suffixed with `Elements`

## Type Generation Examples

### Basic Attributes Example

Given this XSD:
```xml
<xs:element name="uniquePropertyMessageEvictionStrategy">
  <xs:complexType>
    <xs:attribute name="evictExpiredMessagesHighWatermark" type="xs:integer"/>
    <xs:attribute name="propertyName" type="xs:string"/>
  </xs:complexType>
</xs:element>
```

The library generates:

```typescript
export interface UniquePropertyMessageEvictionStrategyAttributes {
  readonly evictExpiredMessagesHighWatermark?: number;
  readonly propertyName?: string;
}

export class UniquePropertyMessageEvictionStrategy
  extends XmlNode
  implements IPolicyEntryMessageEvictionStrategy
{
  constructor(
    public readonly attributes?: UniquePropertyMessageEvictionStrategyAttributes,
  ) {
    super({
      tagName: "uniquePropertyMessageEvictionStrategy",
    });
  }
}
```

### Complex Elements Example

For nested elements and attributes:

```xml
<xs:element name="systemUsage">
  <xs:complexType>
    <!-- XML structure shown in original file -->
  </xs:complexType>
</xs:element>
```

The library generates:

```typescript
export interface SystemUsageAttributes {
  readonly sendFailIfNoSpace?: boolean;
  readonly sendFailIfNoSpaceAfterTimeout?: number;
}

export interface SystemUsageElements {
  readonly memoryUsage?: MemoryUsage;
}

export class SystemUsage extends XmlNode {
  constructor(
    public readonly attributes: SystemUsageAttributes,
    public readonly elements?: SystemUsageElements,
  ) {
    super({
      tagName: "systemUsage",
    });
  }
}
```

### Enum Types

The library automatically generates enum types for restricted string values:

```typescript
export enum PreallocationStrategy {
  SPARSE_FILE = "sparse_file",
  OS_KERNEL_COPY = "os_kernel_copy",
  ZEROS = "zeros",
}
```

### Current Limitations

- TypeScript does not distinguish between integer and floating-point numbers - type validation must be handled by the consumer

- Work is in progress on restriction classes

- `xs:any` elements are currently ignored

- Simple types with restrictions (like `checkpointIntervalType`) are currently mapped to their base types

### Usage Notes

For numeric types with restrictions, the library currently uses the base type (e.g., number for both xs:integer and xs:long). Validation of specific constraints (min/max values, patterns) must be implemented by the consuming application.