var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer();
var fs = require('fs');


const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const discovery = new DiscoveryV1({
  authenticator: new IamAuthenticator({ apikey: process.env.DISCOVERY_IAM_APIKEY }),
  url: process.env.DISCOVERY_URL,
  version: '2017-09-01'
});


router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/discovery', function(req, res, next) {
  console.log(req.body)
  discovery.query(
    {
      environmentId: process.env.ENVIRONMENT_ID,
      collectionId: process.env.COLLECTION_ID,
      configurationId: process.env.CONFIGURATION_ID,
      query: req.body.text
    })
    .then(response => {
      console.log(response)
      //console.log(JSON.stringify(response.result, null, 2));
      res.json({result: response.result, success: true});
    })
    .catch(err => {
      console.log(err);
      //res.json({error: err, success: false});
    });
});


module.exports = router;
