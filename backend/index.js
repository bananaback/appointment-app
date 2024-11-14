import dotenv from 'dotenv';
import app from './server.js';
import connectDB from './configs/db.js';
import { createAdminIfNotExist } from './controllers/adminController.js'; // Make sure to import the function

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create an async function to handle startup logic
async function startServer() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Ensure an admin user is created if one doesn’t exist
        await createAdminIfNotExist();

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit the process if there’s an error
    }
}

// Call the startServer function to kick things off
startServer();
