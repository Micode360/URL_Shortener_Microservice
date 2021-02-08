require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const mongoose  = require('mongoose');
let rankModel = require('./models/rank.model');
var customId = require("custom-id");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.use(express.urlencoded())

app.use('/public', express.static(`${process.cwd()}/public`));


const myURI = process.env.ATLAS_URI;
mongoose.connect(myURI, {useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.on('open', ()=>{
    console.log("MongoDB database connection established succesfully");
})


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



    app.post('/api/shorturl/new', (req,res)=>{
          var url = req.body.url;
          var regex = /(http(s)*:\/\/)\w+(.)*(\/)*/;


          if(regex.test(url) === false){
            res.json({ 
              error: 'invalid url' 
          })}else{
            const myURL = new URL(url);
            dns.lookup(myURL.hostname, (err, address, family) => {
              if(err) res.json({  error: 'invalid url'})

               else{
                rankModel.findOne({url:url}, (err, savedurl) => {
                  if(err) return err;

                  if(savedurl){
                    res.json({
                      original_url: savedurl.url,
                      short_url: savedurl.shortUrl
                    })

                  }else {
                   let shortUrl = customId({
                    uniqueId: 4563 
                  }).slice(0, 2);

                    const rankData = new rankModel({
                      url,
                      shortUrl
                  });



                  rankData.save()
                  .then((data)=>{
                                res.json({
                                original_url: data.url,
                                short_url: data.shortUrl
                              })
                  }).catch(err => res.status(400).json('Error'+ err));
                 }
              })
              }})} 
            });


            app.get('/api/shorturl/:short_url?', (req,res) => {
              console.log(req.params);
                  let shortUrlParams = Number(req.params.short_url);

                  rankModel.findOne({shortUrl:shortUrlParams}, (err, params) => {
                    if(err) return err;
                    else{
                      res.redirect(params.url);
                    }
                  })
            });


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
