import { Router } from "express";
import client from "./routes/mos/client";
import store from "./routes/mos/store";
import card from "./routes/thirdParty/card";
import bankAccount from "./routes/mos/bankAccount";

export default () => {
  const app = Router();
  client(app);
  store(app);
  card(app);
  bankAccount(app);
  return app;
};
