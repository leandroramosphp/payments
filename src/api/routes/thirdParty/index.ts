import card from "./creditCard";
import payment from "./payment";
import config from '../../../config';

export default (app) => {
    app.use(config.api.thirdParty.root, app);
    card(app);
    payment(app);
    return app;
};