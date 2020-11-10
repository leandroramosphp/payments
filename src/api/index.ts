import { Router } from "express";
import mos from "./routes/mos";
import thirdParty from "./routes/thirdParty";

export default () => {
  const app = Router();
  mos(app);
  thirdParty(app);
  return app;
};