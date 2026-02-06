const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
