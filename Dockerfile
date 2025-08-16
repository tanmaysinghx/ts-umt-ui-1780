# Step 1: Build the Angular app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

# Install project dependencies and Angular CLI globally
RUN npm install
RUN npm install -g @angular/cli

COPY . .
RUN npm run build --configuration=production

# Step 2: Serve it using Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# For standard Angular SPA (no SSR)
COPY --from=builder /app/dist/ts-umt-ui-1780 /usr/share/nginx/html

# For Angular SSR (if you use server build)
# COPY --from=builder /app/dist/ts-umt-ui-1780/browser /usr/share/nginx/html

# Copy custom nginx.conf if you want (for SPA route fallback)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
