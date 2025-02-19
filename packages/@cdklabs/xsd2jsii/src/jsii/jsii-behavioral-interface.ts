/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { IJsiiType, JsiiType, JsiiTypeProps } from "./jsii-type";

/**
 * Represents a JSII behavioral interface type
 */
export interface IJsiiBehavioralInterface extends IJsiiType {}

/**
 * Represents a JsiiBehavioralInterface constructor properties
 */
export interface JsiiBehavioralInterfaceProps extends JsiiTypeProps {}

/**
 * Represents a JSII behavioral interface type
 */
export class JsiiBehavioralInterface
  extends JsiiType
  implements IJsiiBehavioralInterface
{
  constructor(props: JsiiBehavioralInterfaceProps) {
    super(props);
  }

  public toJsiiTypeDefinition(): string {
    return `export interface ${this.name} { }`;
  }
}
