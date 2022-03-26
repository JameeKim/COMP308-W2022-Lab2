/**
 * @type {import("@graphql-codegen/typescript").TypeScriptPluginConfig}
 */
const config = {
  strictScalars: true,
  scalars: {
    Date: "Date",
  },
  enumValues: {
    Province: "@dohyunkim/common#Province",
  },
  nonOptionalTypename: true,
  useTypeImports: true,
};

/**
 * @type {import("graphql-config").IGraphQLConfig}
 */
module.exports = {
  schema: ["common/schema.graphql"],
  exclude: ["*.js", "*.gen.{ts,tsx}"],
  extensions: {
    codegen: {
      generates: {
        "server/src/controllers/graphql-resolvers.gen.ts": {
          plugins: [
            "typescript",
            "typescript-resolvers",
          ],
          config: {
            ...config,
            contextType: "apollo-server-express#ExpressContext",
            mappers: {
              Student: "../models/student#StudentDoc",
              Course: "../models/course#CourseDoc",
            },
          },
        },
      },
    },
  },
};
