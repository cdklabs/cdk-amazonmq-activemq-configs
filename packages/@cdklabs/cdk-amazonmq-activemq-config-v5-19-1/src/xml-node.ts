/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
export interface IXmlNode {
  toXmlString(): string;
}

export interface XmlNodeProps {
  readonly elemsNamesOverrides?: { [key: string]: string };
  readonly attrsNamesOverrides?: { [key: string]: string };
  readonly tagName?: string;
  readonly namespace?: string;
}

export class XmlNode implements IXmlNode {
  constructor(private readonly props: XmlNodeProps) {}

  public toXmlString() {
    return [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      this._toXmlString(true),
    ].join("");
  }

  private _toXmlString(withNamespace: boolean = false) {
    const attrs = (this as any).attributes as
      | { [key: string]: any }
      | undefined;
    const elems = (this as any).elements as
      | { [key: string]: XmlNode | XmlNode[] | any }
      | undefined;

    let outString: string = "";

    if (this.props.tagName) {
      outString += `<${this.props.tagName}`;
    }

    const altKey = (key: string, overrides?: { [key: string]: string }) => {
      const altKeyPair =
        overrides &&
        Object.entries(overrides).find(([aKey, _]) => aKey === key);
      if (altKeyPair) return altKeyPair[1];
      return key;
    };

    if (attrs) {
      const keyVals = Object.entries(attrs).map(([key, value]) => {
        if (value instanceof Date) {
          return `${altKey(
            key,
            this.props.attrsNamesOverrides,
          )}="${value.toISOString()}"`;
        }
        return `${altKey(key, this.props.attrsNamesOverrides)}="${value}"`;
      });

      if (withNamespace) {
        keyVals.unshift(`xmlns="${this.props.namespace}"`);
      }

      outString += " " + keyVals.join(" ");
    }

    if (!elems) {
      outString += "/>";
    } else {
      outString += ">";
    }

    if (elems) {
      const elemXmlStrings = Object.entries(elems).map(([key, value]) => {
        const elemTagName = altKey(key, this.props.elemsNamesOverrides);

        let elemOutString = `<${elemTagName}>`;

        if (Array.isArray(value)) {
          elemOutString += value.map((v) => v._toXmlString()).join("");
        } else if (value instanceof XmlNode) {
          elemOutString += value._toXmlString();
        } else if (value instanceof Date) {
          elemOutString += value.toISOString();
        } else {
          elemOutString += value;
        }

        elemOutString += `</${elemTagName}>`;
        return elemOutString;
      });

      outString += elemXmlStrings.join("");

      if (this.props.tagName) {
        outString += `</${this.props.tagName}>`;
      }
    }

    return outString;
  }
}
