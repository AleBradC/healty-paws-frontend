import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8080/graphql",
  documents: "src/lib/graphql/operations.graphql",
  generates: {
    "src/generated/": {
      preset: "client",
      config: {
        // Use string union types instead of enums to be compatible with erasableSyntaxOnly
        enumsAsTypes: true,
        // Use type-only imports to satisfy verbatimModuleSyntax
        useTypeImports: true,
        documentMode: "documentNode",
      },
    },
  },
};

export default config;
