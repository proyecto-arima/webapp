FROM node:alpine3.19

# Set the working directory
WORKDIR /app

# Set react .env vars
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install the serve package globally
RUN npm install -g serve

# Install project dependencies
RUN npm ci

# Copy the rest of the application code
COPY . ./

# Build the React application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app using serve
CMD ["serve", "-s", "build", "-l", "3000"]
