# @cdklabs/cdk-amazonmq-activemq-configs

Generate type-safe Amazon MQ for ActiveMQ broker configurations using CDK-compatible types.

## Overview

This repository provides JSII-compatible packages for generating XML configurations to be used with [@cdklabs/cdk-amazonmq](https://github.com/cdklabs/cdk-amazonmq). The configuration definitions are specifically tailored for Amazon MQ for ActiveMQ brokers and implement a subset of ActiveMQ broker configurations supported by the service. The configuration schema follows the XML definitions published in the AWS documentation for Amazon MQ.

## Features

- ✨ Type-safe configuration generation
- 🌍 Multi-language support through JSII
- 🔄 Automated XSD-to-code generation
- 📦 Version-specific configuration packages

## Prerequisites
Before setting up this project locally, ensure you have:

- NodeJS (for TypeScript/JavaScript development)
- .NET SDK (for .NET package generation)
- Python (for Python package generation)
- Java (for Java package generation and XSD validation tests)

## Getting Started

This project is a monorepo managed with [projen](https://projen.io/) and built on [CdklabsMonorepo](https://github.com/cdklabs/cdklabs-projen-project-types?tab=readme-ov-file#cdklabsmonorepo).

To set up the repository locally:

```bash
yarn install
npx projen
npx projen build
```

## Repository Structure

The repository consists of two main components:

### 1. xsd2jsii (Private Tool)
A specialized tool that generates JSII-compatible type definitions from Amazon MQ for ActiveMQ Configuration XSD files. While currently focused on Amazon MQ configurations, there is a potential to evolve this into a generic XSD-to-JSII converter. At the moment, however, all the tests are performed to create the strongly-typed bindings for the Amazon MQ for ActiveMQ XML Configurations.

### 2. Configuration Packages
Multiple versioned packages following the pattern @cdklabs/cdk-amazonmq-activemq-config-vX.Y.Z. These packages are:

- Automatically generated from official Amazon MQ XSD schemas
- Published as JSII-compatible packages supporting multiple programming languages
- Located in dynamically generated Yarn workspaces
- Built using the xsd2jsii tool
- Source XSD files are stored in the sources/ directory