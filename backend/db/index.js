
const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = (app) => {
  const options = {
    useNewUrlParser: true,
    autoIndex: false, 
      maxPoolSize: 10, 
  };

  const connectWithRetry = () => {
    mongoose.Promise = global.Promise;
    console.log("MongoDB connection with retry");
    mongoose
      .connect(process.env.MONGODB_URI, options)
      .then(() => {
      console.log("MongoDB is connected");
      app.emit("ready");
      })
      .catch((err) => {
      console.log("MongoDB connection unsuccessful, retry after 2 seconds.", err);
      setTimeout(connectWithRetry, 2000);
      });
  };
  connectWithRetry();
};
