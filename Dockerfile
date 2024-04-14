# Use the latest Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Set environment variable for the application port
ENV PORT=3000

# Expose port 3000 to allow communication to the application outside of the container
EXPOSE 3000

# Define the command to start the application
CMD ["npm", "run", "dev"]
