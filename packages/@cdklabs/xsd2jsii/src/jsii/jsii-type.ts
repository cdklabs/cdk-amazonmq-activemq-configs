/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/

/**
 * A base JSII type
 */
export interface IJsiiType {
  readonly name: string;
  toJsiiTypeDefinition(): string;
}

export interface JsiiTypeProps {
  readonly name: string;
}

export abstract class JsiiType implements IJsiiType {
  public readonly name: string;

  constructor(props: JsiiTypeProps) {
    this.name = props.name;
  }

  public abstract toJsiiTypeDefinition(): string;
}
