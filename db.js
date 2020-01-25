const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/cache-me-if-you-can";

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {  
    console.log('Mongoose connection open to ' + dbURI);
}); 
  
mongoose.connection.on('error',function (err) {  
    console.log('Mongoose connection error: ' + err);
}); 
  
mongoose.connection.on('disconnected', function () {  
    console.log('Mongoose connection disconnected'); 
});
  
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log('Mongoose connection disconnected through app termination'); 
        process.exit(0); 
    }); 
});

module.exports = mongoose;