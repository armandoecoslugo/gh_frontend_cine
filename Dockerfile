# Etapa 1: Construcción de la aplicación
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

ARG VITE_CINE_API_URL
ENV VITE_CINE_API_URL=$VITE_CINE_API_URL

RUN npm run build

# Etapa 2: Servidor web de producción
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
