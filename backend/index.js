import dotenv from 'dotenv';
import app from './server.js';
import connectDB from './configs/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
