const express = require('express'),
     http = require('http');

const hostname = 'localhost';
const port = 3005;

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(morgan('dev'));
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);



app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
