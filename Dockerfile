# Use an official Node.js runtime as the base image
FROM node:22.14.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json ./


# Install app dependencies
RUN npm install

RUN npm install -g vite
# Copy the rest of the application code into the container
COPY . .

# Expose the port your app will run on
EXPOSE 8080
RUN npm run build

# Command to start your app (you can adjust it based on your start command)
CMD ["npm", "run", "start"]
