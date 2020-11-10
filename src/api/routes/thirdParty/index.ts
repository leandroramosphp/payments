import card from "./creditCard";
import transaction from "./transaction";
import config from '../../../config';

export default (app) => {
    app.use(config.api.thirdParty.root, app);
    card(app);
    transaction(app);
    return app;
};