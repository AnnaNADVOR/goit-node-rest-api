const app = require("./app");
const mongoose = require("mongoose");
const DB_HOST = "mongodb+srv://anjanadvorna:nodecourse2024@cluster0.ki0kywi.mongodb.net/db-contacts?retryWrites=true&w=majority"
// mongoose.set("strictQuery", true);

mongoose.connect(DB_HOST)
    .then(() => {
app.listen(3000)
console.log("Database connection successful")
// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });
//         console.log("Database connection successful");
     })
    .catch(error => {
        console.log(error.message);
        process.exit(1); //закрити запущені процеси
    });
  
