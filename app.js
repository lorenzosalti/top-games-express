const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

const notFound = require('./middlewares/notFound');
const handleError = require('./middlewares/handleError');
const gamesRouter = require('./routers/gamesRouter');
const mailingController = require('./controllers/mailingController');
const consolesRouter = require('./routers/consolesRouter');
const ordersRouter = require('./routers/ordersRouter');
const homeController = require('./controllers/homeController')

app.get('/', homeController.index)

const { FE_PATH } = process.env;
app.use(cors({
  origin: FE_PATH
}))

app.use('/games', gamesRouter);

// consoles pages
app.use('/console', consolesRouter);

// orders
app.use('/order', ordersRouter);

// pop up mailing 
app.post('/mailing-list', mailingController.mailingStore);

app.use(express.static('public'));


app.use(handleError);
app.use(notFound);


app.listen(port, () => {
  console.log(`Top Games server listening on port ${port}`);
})

