/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
*/
import fs from "fs";
import {
  CdkLabsMonorepo,
  TypeScriptWorkspace,
} from "cdklabs-projen-project-types/lib/yarn";
import { ReleasableCommits, SampleDir, TextFile } from "projen";
import { Jsii } from "./projenrc/jsii";
import { Stability } from "projen/lib/cdk";
import { SourceUpdate } from "./projenrc/update-source";

const stability = Stability.EXPERIMENTAL;

const project = new CdkLabsMonorepo({
  defaultReleaseBranch: "main",
  stability,
  deps: ["semver"],
  devDeps: ["cdklabs-projen-project-types", "@types/semver"],
  name: "@cdklabs/cdk-amazonmq-activemq-configs",
  github: true,
  release: true,
  tsconfigDev: {
    compilerOptions: {
      lib: ["ES2021", "ES2021.String"]
    }
  }
});

new SourceUpdate(project, {
  name: 'config-xsd',
  source: {
    url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-configuration-parameters.html',
    xsdUrlPrefix: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/samples/'
  },
  cwd: 'sources'
});

project.gitignore.exclude("__MACOSX/");

const xsd2jsii = new TypeScriptWorkspace({
  parent: project,
  private: true,
  stability,
  name: "@cdklabs/xsd2jsii",
  packageName: "xsd2jsii",
  bin: {
    xsd2jsii: "bin/xsd2jsii",
  },
  deps: ["json5", "xml2js", "@faker-js/faker"],
  bundledDeps: ["json5", "xml2js", "@faker-js/faker"],
  devDeps: ["@types/xml2js", 'xsd-schema-validator'],
  prettier: true,
  tsconfigDev: {
    include: ["bin/**/*.ts"],
  },
});

xsd2jsii.addFields({ stability });

const schemas = fs.readdirSync("./sources");

const schemaReadmeTemplate = fs.readFileSync(
  "./templates/README_cdk-amazonmq-activemq-config.TEMPLATE.md",
  "utf-8"
);

const generatedTestTsTemplate = fs.readFileSync(
  "./templates/generated.test.ts.template",
  "utf-8"
);

const versionRegex = /^amazon-mq-active-mq-(\d+)\.(\d+)\.(\d+)\.xsd$/;

for (const schema of schemas) {
  const match = versionRegex.exec(schema);
  if (!match) {
    continue;
  }

  const [_, MAJOR, MINOR, PATCH] = match;

  const schemaProject = new TypeScriptWorkspace({
    parent: project,
    stability,
    name: `@cdklabs/cdk-amazonmq-activemq-config-v${MAJOR}-${MINOR}-${PATCH}`,
    authorName: "AWS",
    authorEmail: "cdk-amazonmq-maintainers@amazon.com",
    repository:
      "https://github.com/cdklabs/cdk-amazonmq-activemq-configs",
    devDeps: [xsd2jsii.package.packageName, 'xsd-schema-validator'],
    prettier: true,
    jest: true,
    disableTsconfig: true,
    releasableCommits: ReleasableCommits.featuresAndFixes("."),
  });

  new TextFile(schemaProject, "README.md", {
    marker: true,
    committed: true,
    lines: schemaReadmeTemplate.replaceAll('{{VERSION}}', `${MAJOR}.${MINOR}.${PATCH}`).split('\n')
  });

  new Jsii(schemaProject, {
    stability,
    jsiiVersion: "~5.7.0",
    publishToPypi: {
      distName: `cdklabs.cdk-amazonmq-activemq-config-v${MAJOR}-${MINOR}-${PATCH}`,
      module: `cdklabs.cdk-amazonmq-activemq-config-v${MAJOR}-${MINOR}-${PATCH}`,
    },
    publishToNuget: {
      dotNetNamespace: `Cdklabs.CdkAmazonmq.ActiveMqConfig.V${MAJOR}_${MINOR}_${PATCH}`,
      packageId: `Cdklabs.CdkAmazonmq.ActiveMqConfig.V${MAJOR}-${MINOR}-${PATCH}`,
    },
    publishToMaven: {
      javaPackage: `io.github.cdklabs.cdkamazonmqactivemqconfig.v${MAJOR}_${MINOR}_${PATCH}`,
      mavenGroupId: "io.github.cdklabs",
      mavenArtifactId: `cdk-amazonmq-activemq-config-v${MAJOR}-${MINOR}-${PATCH}`,
    },
    // publishToGo: {
    //   moduleName: `github.com/cdklabs/cdk-amazonmq-activemq-config-v${MAJOR}_${MINOR}_${PATCH}`,
    // },
  });

  project.addGitIgnore(schemaProject.workspaceDirectory + "/tsconfig.json");

  new SampleDir(schemaProject, "src", {
    files: {
      "index.ts": "",
    },
  });

  new TextFile(schemaProject, "test/generated.test.ts", {
    marker: true,
    readonly: false,
    committed: true,
    lines: generatedTestTsTemplate.replaceAll('{{XSD}}', `amazon-mq-active-mq-${MAJOR}.${MINOR}.${PATCH}.xsd`).split('\n')
  });

  schemaProject.preCompileTask.exec(
    `cp ../${xsd2jsii.package.packageName}/src/xml-node.ts ./src/.`
  );

  const licenseBanner = [
    "/*",
    "Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.",
    "SPDX-License-Identifier: Apache-2.0",
    "*/",
  ].join("\\n");

  schemaProject.preCompileTask.exec(
    `echo "${licenseBanner}" > src/generated.ts`
  );

  schemaProject.preCompileTask.exec(
    `ts-node ../xsd2jsii/bin/xsd2jsii.ts ../../../sources/${schema} broker >> src/generated.ts`
  );

  schemaProject.preCompileTask.exec(`echo "${licenseBanner}" > src/index.ts`);
  schemaProject.preCompileTask.exec(
    `echo "export * from './xml-node'\\nexport * from './generated'" >> src/index.ts`
  );

  const eslintTask = schemaProject.tasks.tryFind("eslint");

  if (eslintTask) {
    schemaProject.preCompileTask.spawn(eslintTask);
  }

  schemaProject.node.addDependency(xsd2jsii);
}

project.synth();