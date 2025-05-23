const express = require('express')
const app = express()
const port = 3000

const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleError')
const gamesRouter = require('./routers/gamesRouter')

app.get('/', (req, res) => {
  res.send('Top Games!')
})

app.use('/games', gamesRouter)


app.use(handleError)
app.use(notFound)


app.listen(port, () => {
  console.log(`Top Games server listening on port ${port}`)
})

