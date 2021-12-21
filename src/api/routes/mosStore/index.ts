import { Router } from "express";

import storeRoutes from "./store";
import bankAccountRoutes from "./bankAccount";
import bankTransferRoutes from "./bankTransfer";
import paymentRoutes from "./payment";

export default (app: Router) => {
  storeRoutes(app);
  bankAccountRoutes(app);
  bankTransferRoutes(app);
  paymentRoutes(app);
  return app;
}