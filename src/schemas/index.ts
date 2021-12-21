import store from "./mosStore/store";
import creditCardMos from "./mos/creditCard";
import bankAccount from "./mosStore/bankAccount";
import paymentMos from "./mos/payment";
import paymentMosStore from "./mosStore/payment";
import bankTransfer from "./mosStore/bankTransfer";

export default [
  store,
  creditCardMos,
  bankAccount,
  paymentMos,
  paymentMosStore,
  bankTransfer
];