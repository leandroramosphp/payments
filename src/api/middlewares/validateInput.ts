import { Request, Response, NextFunction } from 'express';
import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { Container } from 'typedi';
import logger from '../../loaders/logger'

let ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

function errorResponse(schemaErrors: ErrorObject[]) {
    let errors = [];
    let anyOf = [];
    let oneOf = [];

    schemaErrors.forEach((error: any) => {
        if (error.params.multipleOf || error.params.keyword === 'multipleOf') {
            if (errors.filter((e) => e.property === error.instancePath.replace('/', '') && e.message === `Property ${error.message}`).length === 0)
                errors.push({ property: error.instancePath.replace('/', ''), message: `Property ${error.message}` })
        }

        if (error.params.type || error.params.format) {
            if (errors.filter((e) => e.property === error.instancePath.replace('/', '') && e.message === `Property ${error.message}`).length === 0)
                errors.push({ property: error.instancePath.replace('/', ''), message: `Property ${error.message}` })
        }

        if (error.params.allowedValues) {
            if (errors.filter((e) => e.property === error.instancePath.replace('/', '') && e.message === `Property ${error.message}: [${error.params.allowedValues}]`).length === 0)
                errors.push({ property: error.instancePath.replace('/', ''), message: `Property ${error.message}: [${error.params.allowedValues}]` })
        }

        if (schemaErrors.filter((s) => s.keyword === 'anyOf').length > 0) {
            if (error.params.missingProperty)
                if (anyOf.filter((e) => e.property === error.params.missingProperty && e.message === `Property required`).length === 0)
                    anyOf.push({ property: error.params.missingProperty, message: `Property required` })
        } else {
            if (schemaErrors.filter((s) => s.keyword === 'oneOf').length > 0) {
                if (error.params.missingProperty)
                    if (oneOf.filter((e) => e.property === error.params.missingProperty && e.message === `Property required`).length === 0)
                        oneOf.push({ property: error.params.missingProperty, message: `Property required` })
            } else {
                if (error.params.missingProperty)
                    if (errors.filter((e) => e.property === error.params.missingProperty && e.message === `Property required`).length === 0)
                        errors.push({ property: error.params.missingProperty, message: `Property required` })
            }
        }
    })

    if (anyOf.length > 0)
        errors.push({ anyOf: anyOf });

    if (oneOf.length > 0)
        errors.push({ oneOf: oneOf });

    return {
        status: 'failed',
        errors: errors
    }
}

let validateInput = (schemaName: string) => {
    const InputSchema = Container.get(schemaName);
    if (!ajv.getSchema(schemaName)) {
        // @ts-ignore
        ajv.addSchema(InputSchema, schemaName);
    }

    return (req: Request, res: Response, next: NextFunction) => {
        let valid = ajv.validate(schemaName, res.locals.data);
        if (!valid) {

            logger.debug('Error validating ' + '\"' + schemaName + '\"' + ': %o\n%o', ajv.errors, { params: req.params, query: req.query, body: req.body, headers: req.headers });

            return res.status(422).send(errorResponse(ajv.errors));
        }
        next();
    }
}

export default validateInput;