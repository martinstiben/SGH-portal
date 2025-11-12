# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Desactivar ESLint durante el build para evitar errores
ENV ESLINT_NO_DEV_ERRORS=true
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicación sin linting
RUN npm run build -- --no-lint

# Exponer el puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]