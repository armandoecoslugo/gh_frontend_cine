
FROM node:24

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json .npmrc ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Ejecutar React en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

