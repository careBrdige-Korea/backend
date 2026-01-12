FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Show what files we have
RUN echo "=== Files in /app ===" && ls -la
RUN echo "=== Files in /app/src ===" && ls -la src/

# Dummy env for prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma client
RUN npx prisma generate

# Build with verbose output
RUN echo "=== Running npm run build ===" && npm run build

# Show build output
RUN echo "=== Build output ===" && ls -la dist/ && ls -la dist/

# Verify main.js exists
RUN test -f dist/main.js && echo "main.js exists!" || echo "main.js NOT FOUND!"

# Clean up
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
