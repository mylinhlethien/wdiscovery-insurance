var express = require('express');
var router = express.Router();
//const multer = require('multer');
//const upload = multer();
//const fs = require('fs');
const MongoClient = require("mongodb").MongoClient;

const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { ObjectId } = require('mongodb');

const discovery = new DiscoveryV1({
  authenticator: new IamAuthenticator({ apikey: process.env.DISCOVERY_IAM_APIKEY }),
  url: process.env.DISCOVERY_URL,
  version: '2017-09-01'
});


router.get('/', function(req, res, next) {
  res.render('index');
});

//connexion à la base MongoDB et requêtes depuis la barre de recherche
router.post('/mongodb', function(req, res, next) {

  let connectionString = process.env.CONNECTION_STRING

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
        var dbo = db.db("insurance");   //nom de la collection MongoDB
        var couverture = Object.keys(req.body)[0]; //texte dans la barre de recherche

        dbo.collection("tables").aggregate([
          { $project: {
              "_id": 1,
              "body_cells.text" : 1,
              "body_cells.row_index_begin" :1,
              "body_cells.column_header_texts" : 1
            }},
          { $unwind: {path: "$body_cells"} },
          { $match: {
              "body_cells.text" : { $regex : new RegExp(couverture, 'i') } //For substring search, case insensitive
              //"body_cells.text" : { $regex : new RegExp('^' + couverture + '$', 'i') } //For exact search, case insensitive
            }
          }
        ])
        .toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          if (result[0] != undefined) {

            var rows = new Array();
            for ( i = 0 ; i < result.length; i++) {
              rows[i] = result[i].body_cells.row_index_begin;
            }
            var ids = new Array();
            for ( i = 0 ; i < result.length; i++) {
              ids[i] = ObjectId(result[i]._id);
            }
            
            //var row_index_begin = result[0].body_cells.row_index_begin;  //on récupère l'indice de la ligne correspondante
            //var id = result[0]._id;

            //requêtes MongoDB pour lire le contenu des cases de la ligne correspondante
            dbo.collection("tables").aggregate([
              { $project: {
                  "_id": 1,
                  "document_contrat" : 1,
                  "body_cells.text" : 1,
                  "body_cells.row_index_begin" :1,
                  "body_cells.column_header_texts" : 1
                }},
              { $unwind: {path: "$body_cells"} },
              { $match: {
                  "body_cells.row_index_begin" : {$in :rows },
                  _id : {$in :ids }
                  /*"body_cells.row_index_begin" : row_index_begin,
                  _id : id*/
                }},
              { $group: {
                  _id: "$body_cells.row_index_begin",
                  document_contrat : {$push : {document_contrat : "$document_contrat"}},
                  body_cells : {$push : {doc_id : "$_id",text : "$body_cells.text", column_header_texts : "$body_cells.column_header_texts"}}
                }},
              { $sort : {
                _id: 1
              }}
            ])
            .toArray(function(err, result) {
              if (err) throw err;
              res.json([ {doc_ids : ids} , result ]);
              //console.log([ {doc_ids : ids} , result ]);
              db.close();         
            });
          }
          else {
            console.log("no results");
            res.json( [{text:"Pas de résultat"}]);
            db.close();
          }

        });   
    }
  });
});

//connexion à la base MongoDB et requêtes depuis la construction de requêtes (field, operator, value)
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

        //requêtes qui relève tous les indices de lignes qui correspondent à la recherche
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
            if (result[0] != undefined) {
              var rows = new Array();
              for ( i = 0 ; i < result[0].body_cells.length; i++) {
                rows[i] = result[0].body_cells[i].row_index_begin;
              }

              //depuis les lignes relevées, on récupère le nom des couvertures
              dbo.collection("tables").aggregate([
                { $project: {
                    "_id": 0,
                    "document_contrat" :1,
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
                    body_cells : {$push : {text : "$body_cells.text"}},
                    document_contrat : {$push : {document_contrat : "$document_contrat"}}
                  }}
              ])
              .toArray( (err, results) => {
                if (err) throw err;
                //console.log(results);
                res.send(results); 
                db.close();
              });
            }
            else {
              console.log("no results");
              res.json( [{ text : "Pas de résultat"}]);
              db.close();
            }
    
        });   
    }
  });
});

//requête Discovery depuis la barre de recherche
router.post('/discovery', function(req, res, next) {

  discovery.query(
    {
      environmentId: process.env.ENVIRONMENT_ID,
      collectionId: process.env.COLLECTION_ID,
      configurationId: process.env.CONFIGURATION_ID,
      passages: true,
      passagesCount: 50,
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

//requête Discovery depuis la construction de requêtes Discovery
router.post('/discoveryqueries', function(req, res, next) {

  discovery.query(
    {
      environmentId: process.env.ENVIRONMENT_ID,
      collectionId: process.env.COLLECTION_ID,
      configurationId: process.env.CONFIGURATION_ID,
      passages: true,
      passagesCount: 50,
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


module.exports = router;
