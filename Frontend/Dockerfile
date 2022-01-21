# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY .env.local ./
RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install react-scripts@5.0.0 -g --silent
RUN npm i --save @fortawesome/free-brands-svg-icons
RUN npm i --save @fortawesome/fontawesome-svg-core


# add app
COPY . ./
EXPOSE 3000
# start app
CMD ["npm", "start"]