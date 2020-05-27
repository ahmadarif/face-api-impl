# Base docker image
FROM node:10-alpine

# Setup Timezone
RUN apk add --update tzdata
ENV TZ=Asia/Jakarta

# Install python and extra build
RUN apk add --no-cache --virtual .build-deps alpine-sdk python \

# Create app directory
WORKDIR /app

# Copy all files
COPY . /app/

# Install dependency
RUN npm install \
 && apk del .build-deps

CMD ["npm", "run", "start"]