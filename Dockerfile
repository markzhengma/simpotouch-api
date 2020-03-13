from registry.markzhengma.com/node:latest

add . /app

workdir /app

run npm install

expose 7001

volume ["/app"]

cmd ["npm", "run", "fg-start"]
