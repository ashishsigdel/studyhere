# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory for the app
WORKDIR /src

# Copy package.json and package-lock.json (if exists) to install dependencies
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the entire src directory into the container
COPY . .

# Build the TypeScript code to the dist directory
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]