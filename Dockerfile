FROM node:latest

WORKDIR /usr/src/auther

COPY ./ ./

RUN cd server && npm install --quiet

CMD ["/bin/bash"]