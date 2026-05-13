const app = require('./src/app');
const connectDB = require('./src/config/db.js');
const port = process.env.PORT || 5000;

// Database connect
connectDB();


// Server Start
app.listen(port,"0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});