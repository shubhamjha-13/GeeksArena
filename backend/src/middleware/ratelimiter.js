const redisClient = require("../config/redis");

const windowSize = 360; // 60min
const maxReq = 60;
const rateLimiter = async (req, res, next) => {
  try {
    const identifier = `${req.ip}:${req.body.email}`;
    const key = `login${identifier}`;
    const current_time = Date.now() / 1000;
    const window_time = current_time - windowSize; //kitne time se pehle walo ko hatana h

    //this will remove the range from 0 to window_time from the set
    await redisClient.zRemRangeByScore(key, 0, window_time);

    const numberOfReq = await redisClient.zCard(key);
    if (numberOfReq >= maxReq) {
      throw new Error("Max req exceeded");
    }

    await redisClient.zAdd(key, [
      { score: current_time, value: `${current_time}:${Math.random()}` },
    ]);
    //req is added

    //key TTl ko increase karo
    await redisClient.expire(key, windowSize);
    next();
  } catch (err) {
    res.send("Error" + err);
  }
};

module.exports = rateLimiter;
