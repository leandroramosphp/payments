FROM node:12.20.1-alpine3.10

COPY ["src", "/app/src/"]
COPY ["package.json", "yarn.lock", "tsconfig.json", "/app/"]

WORKDIR /app

RUN yarn install

CMD [ "sh","-c", \
    "if [ -z $(printenv NODE_ENV) ] || \
        [ -z $(printenv DB_HOSTNAME) ] || \
        [ -z $(printenv DB_USERNAME) ] || \
        [ -z $(printenv DB_PASSWORD) ] || \
        [ -z $(printenv DB_NAME) ] || \
        [ -z $(printenv DB_PORT) ] || \
        [ -z $(printenv USERNAME_ZOOP) ] || \
        [ -z $(printenv MARKET_PLACE_ID) ] || \
        [ -z $(printenv LOG_LEVEL) ] || \
        [ -z $(printenv PORT) ]; \
    then \
        echo 'Required environment variables are not set.'; exit 1; \
    fi && \
    node_modules/.bin/ts-node src/app.ts" ]
