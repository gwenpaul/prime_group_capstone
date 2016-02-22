var express = require('express');
var pg = require('pg');
var router = express.Router();
var connectionString = process.env.DATABASE_URL || require('./databaseurl.json').data;

router.post('/newAsset', function(request, response){
  pg.connect(connectionString, function(err, client){

    var newAsset = {name: request.query.name,
                    description: request.query.description,
                    category: request.query.category,
                    notes: request.query.notes
    };

    var query = client.query('INSERT INTO assets (name, description, category, notes) VALUES ($1, $2, $3, $4)', [newAsset.name, newAsset.description, newAsset.category, newAsset.notes]);


    query.on('end', function(){
      client.end();
      response.send("assets");
    });

    if(err) {
        console.log(error);
        response.send('error');
    }
  });
});

router.post('/updateAsset', function(request, response){
  pg.connect(connectionString, function(err, client){

    var asset = {id: request.query.id,
                name: request.query.name,
                description: request.query.description,
                category: request.query.category,
                notes: request.query.notes
    };

    var query = client.query('UPDATE assets SET name=$1, description=$2, category=$3, notes=$4 WHERE id=$5', [asset.name, asset.description, asset.category, asset.notes, asset.id]);


    query.on('end', function(){
      client.end();
      response.send('view_assets');
    });

    if(err) {
      console.log(err);
      response.send('error');
    }
  });
});

router.get('/getAssets/:sortBy', function(request, response){
  pg.connect(connectionString, function(err, client){
    var results = [];
    var sortBy = 'name';

    if(request.params.sortBy == 'Category'){
        sortBy = 'category';
    }else if (request.params.sortBy == 'Recently Created'){
      sortBy = 'id';
    }else{
      sortBy = 'name';
    }

    var query = client.query('SELECT * FROM assets ORDER BY $1', [sortBy]);

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){
      client.end();
      response.send(results);
    });

    if(err) {
      console.log(err);
      response.send('error');
    }
  });
});


module.exports = router;
