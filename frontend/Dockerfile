# Use Node.js 18 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and lock files to leverage Docker caching
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies
RUN npm install && npm install -g typescript

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the default Next.js port
EXPOSE 3002

# Run the Next.js application
CMD ["npm", "start"]
