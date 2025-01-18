# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies (for development mode)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Use ts-node-dev for hot reloading
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/main.ts"]
