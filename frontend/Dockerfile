##build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY client/package*.json ./client/
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    cd client && npm ci --no-audit --no-fund

COPY client ./client
COPY admin ./admin
RUN cd client && npm run build

##run stage
FROM nginx:stable-alpine

COPY --from=build /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

USER nginx

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
