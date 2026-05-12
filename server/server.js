
const app = require('./src/app');
const connectDB = require('./src/config/db.js');


const port = process.env.PORT || 5000;

// Database connect
connectDB();

// Server Start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});