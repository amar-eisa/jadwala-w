FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# هذا الأمر سينسخ كل ملفات المشروع بما فيها ملف .env
COPY . .

# Vite سيقرأ المتغيرات من ملف .env المنسوخ تلقائياً
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
