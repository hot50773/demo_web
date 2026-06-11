const express = require('express');
const stressRoutes = require('./stressRoutes');
const app = express();
const port = process.env.PORT || 8080;

app.use('/stress', stressRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
