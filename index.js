require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const { count } = require('console');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: true})); // Post parsing middleware for parsing request body

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(_, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Logic for shortening link
let links = {};
let counter = 1;

app.post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  let hostname = url;
  
  // check if url is valid
  try {
    let hostname = new URL(url).hostname;
    dns.lookup(hostname, (err, address, family) => {
      // store into a dictionary
      links[counter] = url;               

      // return json response
      res.json({ original_url: url, 
        short_url: counter });            

      // increment counter for next one
      counter++;                          
    });
  } catch {
    res.json({error: 'invalid url'});
  }
});

// Redirect to original url
app.get('/api/shorturl/:short_url', (req, res) => {
  let id = Number(req.params.short_url);
  res.redirect(links[id]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
