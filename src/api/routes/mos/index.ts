import client from "./client";
import store from "./store";
import bankAccount from "./bankAccount";
import bankTransfer from "./bankTransfer";
import config from '../../../config';

export default (app) => {
    app.use(config.api.payment.root + config.api.payment.version + config.api.payment.prefix, app);
    client(app);
    store(app);
    bankAccount(app);
    bankTransfer(app);
    return app;
};