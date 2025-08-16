# Step 1: Build the Angular app
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Step 2: Serve it with Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/ts-umt-ui-1780/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: If you have SPA routing, add nginx.conf for fallback
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
