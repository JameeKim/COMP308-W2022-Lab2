/**
 * Configuration for GraphQL Code Generator
 * @type {import("@graphql-codegen/plugin-helpers").Types.Config}
 */
const codegen = {
  config: {
    strictScalars: true,
    scalars: {
      Date: "Date",
    },
    enumValues: {
      Province: "@dohyunkim/common#Province",
    },
    nonOptionalTypename: true,
    useTypeImports: true,
  },
  generates: {
    "server/src/controllers/graphql-resolvers.gen.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers",
      ],
      config: {
        contextType: "apollo-server-express#ExpressContext",
        mappers: {
          Student: "../models/student#StudentDoc",
          Course: "../models/course#CourseDoc",
        },
      },
    },
    "client/src/graphql/": {
      preset: "gql-tag-operations-preset",
    },
  },
};

/**
 * @type {import("graphql-config").IGraphQLConfig}
 */
module.exports = {
  schema: ["common/schema.graphql"],
  documents: [
    "client/src/**/*.{ts,tsx}",
    "!*.gen.{ts,tsx}",
    "!*.d.ts",
  ],
  exclude: ["*.js", "*.gen.{ts,tsx}"],
  extensions: {
    codegen,
  },
};
