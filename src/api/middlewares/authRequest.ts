import axios from 'axios';
import config from '../../config';

async function internalRequest(req: any, res: any, next: any, isAuthorizationEnabled: boolean) {
    let authHost = config.authApi.host;
    let authEndpoint = config.authApi.authInternalEndpoint

    let mallId = parseInt(req.query.mallId)
    if (!Number.isInteger(mallId))
        return res.status(400).json({ message: 'Mall ID required.' });

    let urlSplitted = req.baseUrl.split(`${config.api.root + config.api.version}`);
    let baseEndpoint = urlSplitted[urlSplitted.length - 1];

    try {
        let response = await axios.post(`${authHost}${authEndpoint}?mallId=${req.query.mallId}`, {
            method: req.method,
            path: baseEndpoint + req.route.path,
            isAuthorizationEnabled: isAuthorizationEnabled
        }, {
            headers: {
                'x-access-token': req.headers['x-access-token']
            }
        })

        req.headers['employee-id'] = response.headers['employee-id'];
        next();
    } catch (err) {
        return res.status(err.response.status).send(err.response.data)
    }
}

function authorize(isAuthorizationEnabled = true) {
    return async function (req: any, res: any, next: any) {
        let fromThirdParty = req.headers['from-third-party'];
        let partnerKey = req.headers['x-partner-key'];
        let accessToken = req.headers['x-access-token'];
        let fromInternalRequest = req.headers['from-internal-request'];

        if (!fromThirdParty && !partnerKey && !accessToken && !fromInternalRequest)
            return res.status(403).json({ message: 'Access denied.' })

        if ((fromThirdParty || partnerKey) && (accessToken || fromInternalRequest))
            return res.status(403).json({ message: 'Access denied.' })

        if (!fromThirdParty && partnerKey)
            return res.status(403).json({ message: 'Access denied.' })

        if (fromThirdParty)
            return next();

        if (fromInternalRequest)
            return next();

        return await internalRequest(req, res, next, isAuthorizationEnabled);
    }
}

export default authorize