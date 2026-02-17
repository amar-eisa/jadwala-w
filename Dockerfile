# إصلاح التحذير: جعلنا AS بحروف كبيرة
FROM node:20-alpine AS build

WORKDIR /app

# نسخ ملفات تعريف الاعتماديات
COPY package.json package-lock.json ./

# التعديل الهام: استبدال ci بـ install لتفادي مشاكل عدم تطابق ملف القفل
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# تعريف المتغيرات
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# تحويل المتغيرات
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# بناء المشروع
RUN npm run build

# المرحلة الثانية
FROM nginx:alpine

# نسخ إعدادات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# نسخ ملفات البناء
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]