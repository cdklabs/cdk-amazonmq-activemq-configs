/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import { JsiiProperty, JsiiPropertyProps } from "./jsii";

export interface XsdJsiiPropertyProps extends JsiiPropertyProps {
  readonly originalName: string;
}

/**
 * A custom Jsii Property that is used when the default approach to generating a name
 * does not work.
 *
 * Note: When working with Amazon MQ for ActiveMQ configurations it came to be that `map` is such a reserved word,
 * so we needed to override it in the JSII type, but the XML still required `map`.
 */
export class XsdJsiiProperty extends JsiiProperty {
  public readonly originalName: string;

  constructor(props: XsdJsiiPropertyProps) {
    super(props);
    this.originalName = props.originalName;
  }
}
