import { Router } from "express";
import client from "./routes/mos/client";
import store from "./routes/mos/store";
import card from "./routes/thirdParty/card";
import bankAccount from "./routes/mos/bankAccount";
import transaction from "./routes/thirdParty/transaction";
import accountBallance from "./routes/mos/accountBallance";

export default () => {
  const app = Router();
  client(app);
  store(app);
  card(app);
  bankAccount(app);
  transaction(app);
  accountBallance(app);
  return app;
};
