# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# نسخ ملفات تعريف الاعتماديات
COPY package.json package-lock.json ./

# تثبيت الاعتماديات (نستخدم ci لضمان تطابق النسخ)
RUN npm ci

# نسخ باقي ملفات المشروع
COPY . .

# تعريف المتغيرات التي يحتاجها Vite أثناء البناء
# أضف هنا أي متغير يبدأ بـ VITE_ تحتاج تمريره
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# تحويل المتغيرات من ARG إلى ENV لكي يراها أمر البناء
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# بناء المشروع
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# نسخ ملف إعدادات Nginx الذي أنشأناه
COPY nginx.conf /etc/nginx/conf.d/default.conf

# نسخ ملفات المشروع المبنية من المرحلة السابقة إلى مجلد Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# المنفذ الداخلي للحاوية
EXPOSE 80

# تشغيل Nginx
CMD ["nginx", "-g", "daemon off;"]