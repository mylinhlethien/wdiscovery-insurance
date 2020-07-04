var express = require('express');
var router = express.Router();
//const multer = require('multer');
//const upload = multer();
//const fs = require('fs');
const MongoClient = require("mongodb").MongoClient;

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

router.post('/mongodb', function(req, res, next) {

  let connectionString = "mongodb://admin:demoinsurance@10fa5bae-7e7c-44cc-a882-b0bd82c31371-0.br38q28f0334iom5lv4g.databases.appdomain.cloud:32019,10fa5bae-7e7c-44cc-a882-b0bd82c31371-1.br38q28f0334iom5lv4g.databases.appdomain.cloud:32019/ibmclouddb?authSource=admin&replicaSet=replset"

  let options = {
    tls: true,
    tlsCAFile: `./certificate.crt`,
    useUnifiedTopology: true 
  };

  // connects to a MongoDB database
  MongoClient.connect(connectionString, options, function (err, db) {
    if (err) {
        console.log(err);
    } else {
      // lists the databases that exist in the deployment
        /*db.db('example').admin().listDatabases(function(err, dbs) {
            console.log(dbs.databases);
            db.close();
        });*/

        var dbo = db.db("insurance");
        var couverture = Object.keys(req.body)[0];

        dbo.collection("tables").aggregate([
          { $project: {
              "_id": 0,
              "body_cells.text" : 1,
              "body_cells.row_index_begin" :1,
              "body_cells.column_header_texts" : 1
            }},
          { $unwind: {path: "$body_cells"} },
          { $match: {
              "body_cells.text" : couverture
            }}
        ])
        .toArray(function(err, result) {
          if (err) throw err;
          if (result[0] == undefined) {
            res.send(result);
          }
          else {
            var row_index_begin = result[0].body_cells.row_index_begin;

            dbo.collection("tables").aggregate([
              { $project: {
                  "_id": 0,
                  "body_cells.text" : 1,
                  "body_cells.row_index_begin" :1,
                  "body_cells.column_header_texts" : 1
                }},
              { $unwind: {path: "$body_cells"} },
              { $match: {
                  "body_cells.row_index_begin" : row_index_begin
                }},
              { $group: {
                  _id: "$body_cells.row_index_begin",
                  body_cells : {$push : { text : "$body_cells.text", column_header_texts : "$body_cells.column_header_texts"}}
                }}
            ])
            .toArray(function(err, result) {
              if (err) throw err;
              console.log(result[0].body_cells);
              res.send(result[0].body_cells);
              db.close();         
            });
          }
          
        });      
    }
  });
});

router.post('/mongodbqueries', function(req, res, next) {

  let connectionString = "mongodb://admin:demoinsurance@10fa5bae-7e7c-44cc-a882-b0bd82c31371-0.br38q28f0334iom5lv4g.databases.appdomain.cloud:32019,10fa5bae-7e7c-44cc-a882-b0bd82c31371-1.br38q28f0334iom5lv4g.databases.appdomain.cloud:32019/ibmclouddb?authSource=admin&replicaSet=replset"

  let options = {
    tls: true,
    tlsCAFile: `./certificate.crt`,
    useUnifiedTopology: true 
  };

  // connects to a MongoDB database
  MongoClient.connect(connectionString, options, function (err, db) {
    if (err) {
        console.log(err);
    } else {

        var dbo = db.db("insurance");
        var garantie = Object.values(req.body)[0]
        var formule = Object.values(req.body)[1];

        dbo.collection("tables").aggregate([
          { $project: {
              "_id": 0,
              "body_cells.text" : 1,
              "body_cells.row_index_begin" :1,
              "body_cells.column_header_texts" : 1
            }},
          { $unwind: {path: "$body_cells"} },
          { $match: {
              "body_cells.column_header_texts" : formule,
              "body_cells.text" : garantie
            }},
          { $group : {
            _id: "$body_cells.column_header_texts",
            body_cells : {$push : {row_index_begin : "$body_cells.row_index_begin"}}
          }}
        ]).toArray(function(err, result) {
            if (err) throw err;
            var rows = new Array();
            for ( i = 0 ; i < result[0].body_cells.length; i++) {
              rows[i] = result[0].body_cells[i].row_index_begin;
            }

              dbo.collection("tables").aggregate([
                { $project: {
                    "_id": 0,
                    "body_cells.text" : 1,
                    "body_cells.row_index_begin" : 1,
                    "body_cells.column_header_texts" : 1
                  }},
                { $unwind: {path: "$body_cells"} },
                { $match: {
                    "body_cells.row_index_begin" : {$in :rows },
                    "body_cells.column_header_texts" : "GARANTIE"
                  }},
                { $group : {
                    _id: "$body_cells.column_header_texts",
                    body_cells : {$push : {text : "$body_cells.text"}}
                  }}
              ])
              .toArray( (err, results) => {
                if (err) throw err;
                console.log(results[0].body_cells);
                res.send(results[0].body_cells); 
                db.close();
              });
            
        });   
    }
  });
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
      //naturalLanguageQuery: Object.keys(req.body)[0]
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

router.post('/discoveryqueries', function(req, res, next) {

  discovery.query(
    {
      environmentId: process.env.ENVIRONMENT_ID,
      collectionId: process.env.COLLECTION_ID,
      configurationId: process.env.CONFIGURATION_ID,
      passages: true,
      highlight: true,
      deduplicate: false,
      query: Object.values(req.body)[0] + Object.values(req.body)[1] + Object.values(req.body)[2] +","+ Object.values(req.body)[3] + Object.values(req.body)[4] + Object.values(req.body)[5]
    })
    .then(response => {
      //console.log(JSON.stringify(response.result.results, null, 2));
      res.json({result: response.result, success: true});
    })
    .catch(err => {
      console.log(err);
      //res.json({error: err, success: false});
    });

});

/*router.post('/toneanalyzer', function(req, res, next) {

  toneAnalyzer.tone(
    {
      toneInput: Object.keys(req.body)[0],
      contentType: 'text/plain'
    })
    .then(response => {
      //console.log(response.result.document_tone.tone_categories[0]);
      //console.log(JSON.stringify(response.result, null, 2));
      res.json({result: response.result.document_tone.tone_categories[0], success: true});
    })
    .catch(err => {
      console.log(err);
    });

});*/


module.exports = router;
