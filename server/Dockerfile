# ---- Base image ----
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the server source code
COPY . .

# Render/most platforms inject PORT; default to 5000 locally
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]