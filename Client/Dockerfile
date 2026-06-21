# ---- Stage 1: Build the React/Vite app ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# These are build-time args because Vite bakes env vars into the
# bundle at build time, not at container runtime.
ARG VITE_BACKEND_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build

# ---- Stage 2: Serve the built static files with Nginx ----
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for SPA routing (so /apply-job/123 etc. work on refresh)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]