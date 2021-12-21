import { Router } from "express";

import paymentMosRoutes from "./payment";
import creditCardMosRoutes from "./creditCard";

export default (app: Router) => {
  paymentMosRoutes(app);
  creditCardMosRoutes(app);
  return app;
}