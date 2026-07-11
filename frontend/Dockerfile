## build stage ##
FROM node:22-alpine AS build

WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm install

COPY client ./client
COPY admin ./admin
RUN cd client && npm run build

## run stage ##
FROM nginx:alpine

COPY --from=build /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]