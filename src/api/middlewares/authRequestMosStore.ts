import { Request, Response, NextFunction } from "express";
import axios from 'axios';
import config from '../../config';

export default async function Authorize(req: Request, res: Response, next: NextFunction, endpointPermissionCode?: string) {
    try {
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

        let authObjectRequest = {
            token: req.headers['x-access-token'] ? req.headers['x-access-token'].toString() : undefined,
            endpointPermissionCode: endpointPermissionCode,
            storeId: req.query.storeId ? +req.query.storeId : undefined,
            method: req.method,
            path: req.originalUrl.substring(req.originalUrl.length - 1) === '/' ? req.originalUrl.substring(0, req.originalUrl.length - 1) : req.originalUrl
        }
        console.log(authObjectRequest);

        let response = await axios.post(config.authApi.host + config.authApi.mosStorePrefix + config.authApi.authInternalEndpoint, authObjectRequest)

        req.headers['employee-id'] = response.headers['employee-id'];
        return next();
    } catch (err) {
        return res.status(err.response.status || err.status || 500)
            .json({
                message: err.response.data.message || err.message,
                errors: err.response.data.errors
            })
    }
}
