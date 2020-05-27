# Base docker image
FROM node:10-alpine

# Setup Timezone
RUN apk add --update tzdata
ENV TZ=Asia/Jakarta

# Install python and extra build
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python

# Create app directory
WORKDIR /app

# Copy all files
COPY . /app/

# Install dependency
RUN npm install

# Build the app (transpile from TypeScript to JavaScript)
RUN npm run build

CMD ["npm", "run", "start"]