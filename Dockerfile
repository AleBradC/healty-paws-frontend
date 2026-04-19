# Build stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["sh", "-c", "npm install && npm run dev -- --host"]

FROM development AS builder
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Copy build output to nginx static directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom nginx config for the frontend (to handle SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
