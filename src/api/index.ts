import { Router } from "express";
import storeRoutes from "./routes/store";
import bankAccountRoutes from "./routes/bankAccount";
import bankTransferRoutes from "./routes/bankTransfer";
import paymentRoutes from "./routes/payment";
import creditCardRoutes from "./routes/creditCard";

export default (app: Router) => {
  storeRoutes(app);
  bankAccountRoutes(app);
  bankTransferRoutes(app);
  paymentRoutes(app);
  creditCardRoutes(app);
  return app;
}