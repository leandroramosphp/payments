import expressLoader from "./express";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "./logger";
import schemas from "../schemas";

export default async ({ expressApp }) => {
  const schemaList = [];
  schemas.forEach(schema => {
    schema.forEach((endpoint: any) => {
      schemaList.push(endpoint);
    });
  });

  await dependencyInjectorLoader({ schemas: schemaList });
  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};