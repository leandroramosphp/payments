FROM node:14-alpine3.10 as ts-compiler
WORKDIR /app
COPY ["src", "./src/"]
COPY ["package.json", "yarn.lock", "tsconfig.json", "mos-database/prisma/schema.prisma", "./"]
RUN yarn install --production=false
COPY [".", "./"]
RUN yarn run build


FROM node:14-alpine3.10 as ts-remover
WORKDIR /app
COPY --from=ts-compiler ["/app/package.json", "/app/yarn.lock", "./"]
COPY --from=ts-compiler ["/app/schema.prisma", "./mos-database/prisma/"]
COPY --from=ts-compiler ["/app/build", "./"]
RUN yarn install --production=true && rm package.json yarn.lock mos-database -R


FROM node:14-alpine3.10
WORKDIR /app
RUN apk add --no-cache wget
COPY --from=ts-remover ["/app", "./"]
USER 1000
CMD [ "sh","-c", \
    "if [ -z $(printenv NODE_ENV) ] || \
        [ -z $(printenv DATABASE_URL) ] || \
        [ -z $(printenv USERNAME_ZOOP) ] || \
        [ -z $(printenv AUTH_API_HOST) ] || \
        [ -z $(printenv LOG_LEVEL) ] || \
        [ -z $(printenv KEY) ] || \
        [ -z $(printenv IV) ] || \
        [ -z $(printenv PORT) ]; \
    then \
    echo 'Required environment variables are not set.'; exit 1; \
    fi && \
    node app.js" ]