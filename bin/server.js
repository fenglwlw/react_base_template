#!/usr/bin/env node

require('./babel-reg');

const server = require('./server.babel');
server.start();