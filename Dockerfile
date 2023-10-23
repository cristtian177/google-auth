# Utiliza una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto 5000 (asegúrate de que coincida con el puerto en tu aplicación)
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD [ "node", "src/index.js" ]
