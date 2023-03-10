const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
const { port , mongoose:mongooseConfig} = config;

app.listen(port, () => {
  console.log(`Server listening at port ${port}...`);
});

mongoose.connect(mongooseConfig.url, mongooseConfig.options, () => {
  console.log(`Mongoose listening at URL ${mongooseConfig.url}`);
});
