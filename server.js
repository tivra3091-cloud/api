const express = require('express');
const app = express();
const PORT = 3000;
const route = require("./router/route")

// Middleware
app.use(express.json());

app.use('/api/v1', route);

// Routes
// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// app.get('/about', (req, res) => {
//     res.send('This is the about page!');
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
