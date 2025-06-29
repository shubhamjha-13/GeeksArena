const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-11926.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 11926,
  },
});

module.exports = redisClient;
