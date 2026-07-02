import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost/graphql",
  documents: "src/lib/graphql/operations.graphql",
  generates: {
    "src/generated/": {
      preset: "client",
      config: {
        enumsAsTypes: true,
        useTypeImports: true,
        documentMode: "documentNode",
      },
    },
  },
};

export default config;
