# Development Dockerfile for NestJS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better cache usage)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client (important for your project)
RUN npx prisma generate

# Expose port
EXPOSE 3003

# Start NestJS app in dev mode
CMD ["npm", "run", "start:dev"]
