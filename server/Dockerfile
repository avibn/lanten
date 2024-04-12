# Base image
FROM node:16-alpine as base

# Install bash
RUN apk add --no-cache bash

# Define DATABASE_URL as a build argument
ARG DATABASE_URL

# Set DATABASE_URL as an environment variable
ENV DATABASE_URL=$DATABASE_URL

# Package files
COPY package*.json ./

# Install
RUN npm install

# Copy source code
COPY src ./src
COPY prisma ./prisma
COPY @types ./@types
COPY tsconfig.json ./tsconfig.json

# Copy wait-for-it.sh and make it executable
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Generate prisma client
RUN npx prisma generate

# Build dist
RUN npm run build

# Production image
FROM node:16-alpine

# Install bash
RUN apk add --no-cache bash

# Copy node_modules and dist from base image
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./dist ./dist
COPY --from=base ./prisma ./prisma

# Copy wait-for-it.sh and make it executable
COPY --from=base ./wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

EXPOSE 5000

# Use wait-for-it.sh before running the migration and starting the application
CMD ./wait-for-it.sh db:5432 -- npx prisma migrate deploy && node dist/server.js