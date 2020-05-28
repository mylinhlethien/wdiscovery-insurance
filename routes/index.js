var express = require('express');
var router = express.Router();
const multer = require('multer');
//const upload = multer();
//var fs = require('fs');

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const discovery = new DiscoveryV1({
  authenticator: new IamAuthenticator({ apikey: process.env.DISCOVERY_IAM_APIKEY }),
  url: process.env.DISCOVERY_URL,
  version: '2017-09-01'
});

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2016-05-19',
  authenticator: new IamAuthenticator({
    apikey: process.env.TONEANALYZER_IAM_APIKEY,
  }),
  url: process.env.TONEANALYZER_URL,
});

router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/discovery', function(req, res, next) {

  discovery.query(
    {
      environmentId: process.env.ENVIRONMENT_ID,
      collectionId: process.env.COLLECTION_ID,
      configurationId: process.env.CONFIGURATION_ID,
      passages: true,
      highlight: true,
      deduplicate: false,
      //count: 5,
      //query: req.body.text ? `enriched_text.entities.text:"${req.body.text}"` : ""
      /*aggregation: '[term(enriched_text.entities.text).term(enriched_text.sentiment.document.label),' +
      'term(enriched_text.categories.label).term(enriched_text.sentiment.document.label),' +
      'term(enriched_text.concepts.text).term(enriched_text.sentiment.document.label),' +
      'term(enriched_text.keywords.text).term(enriched_text.sentiment.document.label),' +
      'term(enriched_text.entities.type).term(enriched_text.sentiment.document.label)]',*/
      query: Object.keys(req.body)[0]
    })
    .then(response => {
      //console.log(JSON.stringify(response.result, null, 2));
      res.json({result: response.result, success: true});
    })
    .catch(err => {
      console.log(err);
      //res.json({error: err, success: false});
    });
});


router.post('/toneanalyzer', function(req, res, next) {

  toneAnalyzer.tone(
    {
      toneInput: Object.keys(req.body)[0],
      contentType: 'text/plain'
    })
    .then(response => {
      //console.log(response.result.document_tone.tone_categories[0]);
      res.json({result: response.result.document_tone.tone_categories[0], success: true});
    })
    .catch(err => {
      console.log(err);
    });

});


module.exports = router;
