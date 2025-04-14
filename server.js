const express = require('express');
const path = require('path');
const app = express();

// Simple test route
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Serve static files from the React app
app.use(express.static('build'));

// The "catchall" handler for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Visit http://localhost:${port} in your browser`);
}); 