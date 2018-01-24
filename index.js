var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Diacritics = require('diacritic');
var Food = require('./models/food');
var User = require('./models/user');
var app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds161209.mlab.com:61209/cookmix_listfood'
, {useMongoClient: true});




app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/searching', function(req, res){
  var body = req.body;
  var keySearchFormat = Diacritics.clean(body.keySearch.toLowerCase());
  Food.find(function(err, foods){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      var foodsReturn = [];
      foods.forEach(function(value){
        var nameFormat = Diacritics.clean(value.name.toLowerCase());
        if(nameFormat.indexOf(keySearchFormat)>-1){
          foodsReturn.push(value);
        }
      });
      res.json({food:foodsReturn});
    }
  });
});


app.post('/createFood', function(req, res){
  var body = req.body;

  // var idValue = body.id;
  var nameValue = body.name;
  var authorValue= body.author;
  var imageShowValue= body.imageShow;
  var typeValue= body.type;
  var timeValue= body.time;
  var setsValue= body.sets;
  var levelValue= body.level;
  var ratingValue= body.rating;
  var rateNumValue = body.rateNum;
  var materialValue = body.material;
  var cookValue = body.cook;
  var listRateValue = body.listRate;
  var authorNameValue = body.authorName;

  var food = new Food({
      // id:idValue,
      name:nameValue,
      author:authorValue,
      imageShow:imageShowValue,
      type: typeValue,
      time:timeValue,
      sets:setsValue,
      level:levelValue,
      rating:ratingValue,
      rateNum:rateNumValue,
      material:materialValue,
      cook:cookValue,
      listRate:listRateValue,
      authorName: authorNameValue
    });


  food.save(function(err, createdFood){
      if(err){
          res.json({"success":0, "message": "Could not add record: "+err});
      }else {
          res.json(createdFood);
      }
    }
  );
});
app.get('/getFood', function(req, res){
  Food.find(function(err, foods){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      res.send({food:foods  });
    }
  });
});
app.get('/getTopFood', function(req, res){
  var mysort = { rating: -1 };
  Food.find().sort(mysort).exec(function(err, result){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      res.send({food:result});
    }
  });
});
app.put('/updateFood/:foodId', function(req, res){
  Food.findById(req.params.foodId, function (err, food) {
  // Handle any possible database errors
    if (err) {
        res.status(500).send(err);
    } else {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.


        food.name = req.body.name || food.name;
        food.author = req.body.author || food.author;
        food.imageShow = req.body.imageShow || food.imageShow;
        food.type = req.body.type || food.type;
        food.time = req.body.time || food.time;
        food.sets = req.body.sets || food.sets;
        food.level = req.body.level || food.level;
        food.rating = req.body.rating || food.rating;
        food.rateNum = req.body.rateNum || food.rateNum;
        food.material = req.body.material || food.material;
        food.cook = req.body.cook || food.cook;
        food.listRate = req.body.listRate || food.listRate;
        food.authorName = req.body.authorName || food.authorName;

        // Save the updated document back to the database
        food.save(function (err, food) {
            if (err) {
                res.status(500).send(err)
            }
            res.send(food);
        });
    }
  });
});
app.delete('/deleteFood/:foodId', function(req, res){
    var foodId = req.params.foodId;

    Food.findByIdAndRemove(foodId, function(error, food) {
      if(err){
        res.json({"success": 0, "message": "Could not delete data from mlab"});
      }else {
        res.json({"success": 1, "message": "Delete succesfully"});
      }
    });
});
app.get('/getFoodByType/:typeFood', function(req, res){
  var typeFood = req.params.typeFood;
  Food.find({'type':typeFood}, function(err, foods){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      res.send({food:foods});
    }
  });
});

app.get('/getFoodById/:idFood', function(req, res){
  var idFood = req.params.idFood;
  Food.findById(idFood, function (err, food) {
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      res.send(food);
    }
  });
});

app.get('/getFoodByUser/:userId', function(req, res){
  var userId = req.params.userId;
  Food.find({'author':userId}, function(err, foods){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      res.send({food:foods});
    }
  });
});

// app.get('/getFoodFavorite/:userId', function(req, res) {
//     User.findOne({'idFb':req.params.userId}, function (err, userFound) {
//         if(err){
//             res.json({success: 0, message: "Could not get data from mlab"});
//         }else {
//             var foodsReturn = [];
//             var listFavoriteValue = userFound.listFavorite;
//             listFavoriteValue.forEach(function(value){
//                 Food.findById(value, function (err, food) {
//                     if (err) {
//                         res.json({success: 0, message: "Could not get data from mlab"});
//                     } else {
//                         foodsReturn.push(food);
//                         console.log("FindById: " + foodsReturn);
//                     }
//                 });
//                 console.log("Foreach: "+foodsReturn);
//             });
//             console.log("Return"+foodsReturn);
//             res.send({food:foodsReturn});
//         }
//     });
// });



app.get('/getFoodFavorite/:userId', function(req, res) {

    User.findOne({'idFb':req.params.userId}).populate('listFavorite').exec(function(err, userFound) {
      if (err)
        console.log('Error in view survey codes function');
      if (!userFound || userFound.listFavorite.length < 1)
        res.send('No favorite are yet added.');
      else
        res.send({food:userFound.listFavorite});
    });
});

app.post('/createUser', function(req, res){
  var body = req.body;

    User.findOne({'idFb':body.idFb}, function (err, user) {
      if(err){
            res.json({"success":0, "message": "Could not add record: "+err});
      }else{
        if(user){
          // Update each attribute with any possible attribute that may have been submitted in the body of the request
          // If that attribute isn't in the request body, default back to whatever it was before.

          // user.idFb = req.body.idFb || user.idFb;
          user.avaFb = req.body.avaFb || user.avaFb;
          user.nameFb = req.body.nameFb || user.nameFb;
          user.emailFb = req.body.emailFb || user.emailFb;
          user.ratePoint = req.body.ratePoint || user.ratePoint;
          user.rateNum = req.body.rateNum || user.rateNum;
          user.listSub = req.body.listSub || user.listSub;
          user.listFavorite = req.body.listFavorite || user.listFavorite;

          // Save the updated document back to the database
          user.save(function (err, user) {
              if(err){
                  res.json({"success":0, "message": "Could not update record: "+err});
              }else {
                  res.json(user);
              }
          });
        }else{
            // var idValue = body.id;
            var idValue = body.idFb;
            var avaValue = body.avaFb;
            var nameValue=body.nameFb;
            var emailValue = body.emailFb;
            var ratePointValue = body.ratePoint;
            var rateNumValue = body.rateNum;
            var listSubValue = body.listSub;
            var listFavoriteValue = body.listFavorite;
              var user = new User({
                  // id:idValue,
                  idFb: idValue,
                  avaFb: avaValue,
                  nameFb: nameValue,
                  emailFb: emailValue,
                  ratePoint: ratePointValue,
                  rateNum: rateNumValue,
                  listSub: listSubValue,
                  listFavorite: listFavoriteValue
                });
                user.save(function(err, createdUser){
                    if(err){
                        res.json({"success":0, "message": "Could not add record: "+err});
                    }else {
                        res.json(createdUser);
                    }
                  }
                );
        }
      }
    });



});
app.get('/getAllUser', function(req, res){
  User.find(function(err, users){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      res.send(users);
    }
  });
});
app.get('/getUserProfile/:userId', function(req, res){
  User.findOne({'idFb':req.params.userId}, function (err, user) {
  // User.findById(req.params.userId,function(err, user){
    if(err){
      res.json({success: 0, message: "Could not get data from mlab"});
    }else {
      // res.json(foods);
      res.send(user);
    }
  });
});
app.put('/updateUser/:userId', function(req, res){
  // User.findById(req.params.userId, function (err, user) {
    User.findOne({'idFb':req.params.userId}, function (err, user) {
  // Handle any possible database errors
    if (err) {
        res.status(500).send(err);
    } else {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.

        // user.idFb = req.body.idFb || user.idFb;
        user.avaFb = req.body.avaFb || user.avaFb;
        user.nameFb = req.body.nameFb || user.nameFb;
        user.emailFb = req.body.emailFb || user.emailFb;
        user.ratePoint = req.body.ratePoint || user.ratePoint;
        user.rateNum = req.body.rateNum || user.rateNum;
        user.listSub =req.body.listSub || user.listSub;
        user.listFavorite = req.body.listFavorite || user.listFavorite;

        // Save the updated document back to the database
        user.save(function (err, user) {
            if (err) {
                res.status(500).send(err)
            }else {
              res.send(user);
            }
        });
    }
  });
});
