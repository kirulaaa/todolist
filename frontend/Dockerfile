FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

# Serve the static build with nginx
FROM nginx:alpine AS runtime

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
