import { Router } from "express";
import client from "./routes/client";

export default () => {
  const app = Router();
  client(app);
  return app;
};
