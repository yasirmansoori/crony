# Use official Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build TypeScript (if needed)
RUN npm run build

# Expose the desired port
EXPOSE 8000

# Command to run the app
CMD ["npm", "run", "start"]
