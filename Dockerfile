# Вибір базового образу для Node.js
FROM node:16

# Встановлення робочої директорії
WORKDIR /app

# Копіювання файлів package.json і package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всіх файлів в контейнер
COPY . .

# Відкриття порту 3000
EXPOSE 3000

# Команда для запуску сервера
CMD ["node", "server.js"]
