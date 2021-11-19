const express = require('express')
const app = express()
const port = 3000

app.use('/game', express.static(__dirname + '/game'));
app.use('/web', express.static(__dirname + '/web'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
