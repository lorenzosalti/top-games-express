const express = require('express')
const app = express()
const port = 3000

const notFound = require('./middlewares/notFound')
const handleError = require('./middlewares/handleError')
const gamesRouter = require('./routers/gamesRouter')
const mailingController = require('./controllers/mailingController')
const consolesRouter = require('./routers/consolesRouter')
const ordersRouter = require('./routers/ordersRouter')

app.get('/', (req, res) => {
  res.send('Homepage')
})

app.use('/game', gamesRouter)

app.use('/console', consolesRouter)

app.use('/order', ordersRouter)

app.post('/mailing-list', mailingController.mailingStore)


app.use(handleError)
app.use(notFound)


app.listen(port, () => {
  console.log(`Top Games server listening on port ${port}`)
})

