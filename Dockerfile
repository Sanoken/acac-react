# Use official Node.js image as the base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Use nginx as the web server
FROM nginx:stable-alpine

# Copy built React files to the Nginx server directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
