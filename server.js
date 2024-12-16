// server.js
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;  // Render sets the port environment variable

// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '/')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
