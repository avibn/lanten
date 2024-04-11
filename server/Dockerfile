FROM node:20.11.1-alpine as base

# Package files
COPY package*.json ./

# Install
RUN npm install

# Copy source code
COPY src ./src
COPY prisma ./prisma
COPY @types ./@types
COPY tsconfig.json ./tsconfig.json

# Generate prisma client
RUN npx prisma generate
RUN npx prisma migrate deploy

# Build dist
RUN npm run build

# Production image
FROM node:20.11.1-alpine
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist

EXPOSE 5000
CMD ["dist/server.js"]