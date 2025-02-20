# Use official Node.js image as the base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

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
COPY --from=build /app/build /usr/share/nginx/html


# Copy SSL certificates
COPY certs/nginx.crt /etc/nginx/nginx.crt
COPY certs/nginx.key /etc/nginx/nginx.key

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
