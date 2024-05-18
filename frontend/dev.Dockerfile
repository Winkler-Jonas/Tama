# Use the latest LTS version of Node.js
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]
