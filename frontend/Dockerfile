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

RUN adduser -D restaurant

COPY --from=build /app/client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

RUN chown -R restaurant:restaurant /usr/share/nginx/html
    
USER restaurant

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]