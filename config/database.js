const mongoose = require('mongoose');

exports.connect = () => {
      // Connecting to the database
  mongoose.connect('mongodb+srv://zt-user:R4ys4EM2wdougyk6@zeetim-test.5edod.mongodb.net/site-management?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    });
}