import card from "./creditCard";
import payment from "./payment";
import config from '../../../config';

export default (app) => {
    app.use(config.api.thirdParty.root + '(' + config.api.thirdParty.version + ')?' + config.api.thirdParty.prefix, app);
    card(app);
    payment(app);
    return app;
};