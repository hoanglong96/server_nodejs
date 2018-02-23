var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Diacritics = require('diacritic');

//import model
var Food = require('./models/food');
var User = require('./models/user');
var UserInfo = require('./models/userInfo');
var NewsFeed = require('./models/newsfeed');
var NhomTu = require('./models/nhomTu');
var TuTrongNhomTu = require('./models/TuVung')
var MeoToeic = require('./models/meoToeic')

var arrWord = new Array();
var arrNghia = new Array();

var app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hoanglong96:hoanglong96@ds111618.mlab.com:11618/hoanglongdb'
  , { useMongoClient: true });

//Set port 
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

var fs = require('fs');
var array = fs.readFileSync('file.in').toString().split("\n");

var request = require('request');
var cheerio = require('cheerio');

//crawl nhom tu vung
var urlNhomTuVung = "http://600tuvungtoeic.com/";
request(urlNhomTuVung, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body);

    var arrImage = new Array()
    var arrContent = new Array()
    var arrLink = new Array()
    var idNhomTu = 0;

    var title = $('.overlay a').each(function (i, elem) {
      var link = "http://600tuvungtoeic.com/" + $(this).attr('href')
      // request(link,function(er,response,body){
      //   if(!err && response.statusCode == 200){
      //     var $ = cheerio.load(body);
      //     var hinhanh = $('.hinhanh img').each(function(i,elem){
      //       var linkAnhTuVung = $(this).attr('src')
      //       console.log(linkAnhTuVung)
      //     })
      //   }
      // })
      arrLink.push(link)
    })

    console.log(arrLink)

    var image = $('.gallery-item img').each(function (i, elem) {
      var imagelink = $(this).attr('src')
      arrImage.push(imagelink)
    })

    var content = $('.content-gallery h3').each(function (i, elem) {
      var contentNhomTu = $(this).text()
      arrContent.push(contentNhomTu)
    })

    for (var i = 0; i < arrImage.length; i++) {
      var nhomTu = new NhomTu({
        idNhomTu: i + 1,
        tenNhomTu: arrContent[i],
        anhMinhHoa: arrImage[i],
      })

      nhomTu.save(function (err, taoNhomTu) {
        //console.log("save " + title)
        if (err) {
          console.log("error")
        } else {
          console.log("success")
        }
      })
    }

    var arrIdNhom = new Array();
    for (var i = 0; i < arrLink.length; i++) {
      arrIdNhom.push(index)
    }

    for (var index = 0; index < arrLink.length; index++) {
      var urlLinkNhomTu = arrLink[index]
      arrIdNhom.push(index)
      request(urlLinkNhomTu, function (err, response, body) {
        if (!err && response.statusCode == 200) {
          var $ = cheerio.load(body);

          var arrNoiDungTu = new Array();
          var arrImageTu = new Array();
          var arrAudio = new Array();

          var hinhanhtu = $('.hinhanh img').each(function (i, elem) {
            var imageTu = $(this).attr('src')
            arrImageTu.push(imageTu)
          })
          var tu = $('.noidung').each(function (i, elem) {
            var noidungTu = $(this).text()
            arrNoiDungTu.push(noidungTu)
          })

          var audio = $('.noidung audio source').each(function (i, elem) {
            var audioTu = $(this).attr('src')
            arrAudio.push(audioTu)
          })


          for (var i = 0; i < arrAudio.length; i++) {
            console.log(index)
            var tuVung = new TuTrongNhomTu({
              id: index * 12 + i + 1,
              content: arrNoiDungTu[i],
              idNhomTu: index + 1,
              image: arrImageTu[i],
              audio: arrAudio[i]
            })

            tuVung.save(function (err, taoTuVung) {
              if (err) {
                console.log("error" + err)
              } else {
                console.log("success")
              }
            })
          }
        } else {
          console.log('error')
        }
      })
    }


  } else {
    console.log('error')
  }
})


//crawl data video ngu phap toeic
var urlVideo = "https://www.youtube.com/watch?v=Iqs6PGoJzsQ&list=PL6B8DaHavsG1O4YagP4gY_bbrFI9zjMGz";
request(urlVideo, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body);

  } else {
    console.log('error')
  }
})

//crawl data meo toeic
var url = 'https://giasutoeic.com/meo-thi-toeic/';

request(url, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body);

    var idMeoToeic = 1;
    var titleMeoToeic;
    var imageMeoToeic;
    var desMeoToeic;

    //crawl title
    var title1 = $('.post-title').text().split("\n");
    var title2 = new Array();
    for (var i = 0; i < title1.length; i++) {
      if (title1[i].length != 0) {
        title2.push(title1[i])
      }
    }

    //crawl desc
    var des1 = $('.post-desc .post-brief-desc').text().split("\n");
    var des2 = new Array();
    for (var i = 0; i < des1.length; i++) {
      if (des1[i].length != 0 && des1[i] !== "Đọc bài này" && des1[i].length != 1 && des1[i] !== " Đọc bài này") {
        des2.push(des1[i])
      }
    }

    //crawl image
    var image2 = new Array();
    var image1 = $('.post-image a img').each(function (i, elem) {
      image2.push($(this).attr('data-cfsrc'))
    })

    for (var i = 0; i < $('.post-image').length; i++) {
      var i1 = $('.post-image img').attr('data-cfsrc')
    }

    //post data
    var length = $('.post-wrapper.clearfix').length;

    for (var i = 0; i < length; i++) {

      MeoToeic.findOne({ 'id': i + 1 }, function (err, meotoeic) {

      })

      var title = title2[i]
      var link = ""
      titleMeoToeic = title;
      imageMeoToeic = "https://giasutoeic.com" + image2[i];
      //console.log(imageMeoToeic)
      desMeoToeic = des2[i];

      var meoToeic = new MeoToeic({
        id: i + 1,
        name: titleMeoToeic,
        des: desMeoToeic,
        image: imageMeoToeic
      })

      // meoToeic.save(function(err,taoMeoToeic){
      //   //console.log("save " + title)
      //   if(err){
      //     console.log("error")
      //   }else{
      //     console.log("success")
      //   }
      // })
    }
  }
  else console.log('Error');
})

//get all meo
app.get('/getMeoToeic', function (req, res) {
  MeoToeic.find(function (err, meoToeic) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ MeoToeic: meoToeic });
    }
  });
});

//post tu 
app.post('/taoTu', function (req, res) {

  for (i in array) {
    if (i % 2 == 0) {
      arrWord.push(array[i])
    } else { i % 2 == 1 } {
      arrNghia.push(array[i])
    }

    var idNhomTu1 = "1"
    var idTu1 = i + ""
    var word1 = arrWord[i]
    var nghia1 = arrNghia[i]

    var TuVung = new TuTrongNhomTu({
      idNhomTu: idNhomTu1,
      idTu: idTu1,
      word: word1,
      nghia: nghia1
    });

    TuVung.save(function (err, taoTu) {
      if (err) {
        res.json({ "success": 0, "message": "Could not add record: " + err })
      } else {
        res.json({ taoTu })
      }
    })
  }
})

//Post nhóm từ
app.post('/create_words', function (req, res) {
  var body = req.body;
  NhomTu.findOne({ 'idNhomTu': body.idNhomTu }, function (err, nhomTu) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      if (nhomTu) {
        nhomTu.save(function (err, nhomTu) {
          if (err) {
            res.json({ "success": 0, "message": "Could not update record: " + err });
          } else {
            res.json({ nhomTu })
          }
        });
      } else {
        var idNhomTu1 = body.idNhomTu;
        var tenNhomTu1 = body.tenNhomTu;
        var anhMinhHoa1 = body.anhMinhHoa;

        var nhomTu = new NhomTu({
          idNhomTu: idNhomTu1,
          tenNhomTu: tenNhomTu1,
          anhMinhHoa: anhMinhHoa1
        });

        nhomTu.save(function (err, createNhomTu) {
          if (err) {
            res.json({ "success": 0, "message": "Could not add record: " + err })
          } else {
            res.json(createNhomTu)
          }
        })
      }
    }
  })

})

//Get all nhomTu
app.get('/getAllNhomTu', function (req, res) {
  NhomTu.find(function (err, nhomTus) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ NhomTu: nhomTus });
    }
  });
});

//Delete NhomTu
app.delete('/delNhomTu/:idNhomTu', function (req, res) {
  var idNhomTu = req.params.idNhomTu;

  NhomTu.findByIdAndRemove(idNhomTu, function (err, nhomTu) {
    if (err) {
      res.json({ "success": 0, "message": "Could not delete data from mlab" });
    } else {
      res.json({ "success": 1, "message": "Delete succesfully" });
    }
  });
});

// //post tu 
// app.post('/taoTu', function (req, res) {
//   var body = req.body;
//   TuTrongNhomTu.findOne({'idTu' : body.idTu}, function (err, tu) {
//     if (err) {
//       res.json({ "success": 0, "message": "Could not add record: " + err });
//     } else {
//       if (tu) {
//         tu.save(function (err, tus) {
//           if (err) {
//             res.json({ "success": 0, "message": "Could not update record: " + err });
//           } else {
//             res.json({tus})
//           }
//         });
//       }else{
//         var idNhomTu1 = body.idNhomTu;
//         var idTu1 = body.idTu;
//         var word1 = body.word;
//         var nghia1 = body.nghia;

//         var TuVung = new TuTrongNhomTu({
//           idNhomTu: idNhomTu1,
//           idTu: idTu1,
//           word: word1,
//           nghia: nghia1
//         });

//         TuVung.save(function(err,taoTu){
//           if(err){
//             res.json({"success": 0,"message": "Could not add record: " + err})
//           }else{
//             res.json(taoTu)
//           }
//         })
//       }
//     }
//   })
// })

//Get All Tu trong nhom tu
app.get('/getTuTrongNhom/:idNhomTu', function (req, res) {
  var idNhomTu = req.params.idNhomTu;
  TuTrongNhomTu.find({ idNhomTu: req.params.idNhomTu }, function (err, tuvung) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ tuvung: tuvung });
    }
  });
});

//Get All Tu
app.get('/getAllTu/', function (req, res) {
  TuTrongNhomTu.find(function (err, tu) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" + err });
    } else {
      res.send(tu);
    }
  });
});


//Create User
app.post('/create_user', function (req, res) {
  var body = req.body;

  UserInfo.findOne({ 'idFb': body.idFb }, function (err, user) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      if (user) {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.

        // user.idFb = req.body.idFb || user.idFb;

        // Save the updated document back to the database
        user.save(function (err, user) {
          if (err) {
            res.json({ "success": 0, "message": "Could not update record: " + err });
          } else {
            res.json(user);
            console.log("co user roi")
          }
        });
      } else {
        // var idValue = body.id;
        var idValue = body.idFb;
        var avaValue = body.avatar;
        var nameValue = body.fullname;
        var numFollowValue = body.numFollow;
        var userFollowValue = body.userFollow;
        var dateValue = body.date;
        var listNewsValue = body.listNews;

        var user = new UserInfo({
          // id:idValue,
          idFb: idValue,
          avatar: avaValue,
          fullname: nameValue,
          numFollow: numFollowValue,
          userFollow: userFollowValue,
          date: dateValue,
          listNews: listNewsValue
        });
        user.save(function (err, createdUser) {
          if (err) {
            res.json({ "success": 0, "message": "Could not add record: " + err });
          } else {
            res.json(createdUser);
          }
        }
        );
      }
    }
  });
});

//Get All User
app.get('/get_all_user', function (req, res) {
  UserInfo.find(function (err, users) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send(users);
    }
  });
});

//GetProfile User
app.get('/getUserProfile/:userId', function (req, res) {
  UserInfo.findOne({ 'idFb': req.params.userId }, function (err, user) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send(user);
    }
  });
});

//Update User
app.put('/updateUser/:userId', function (req, res) {
  // User.findById(req.params.userId, function (err, user) {
  UserInfo.findOne({ 'idFb': req.params.userId }, function (err, user) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.

      // user.idFb = req.body.idFb || user.idFb;
      user.avatar = req.body.avatar || user.avatar;
      user.fullname = req.body.fullname || user.fullname;
      user.userFollow = req.body.userFollow || user.userFollow;
      user.listNews = req.body.listNews || user.listNews;
      user.userFollow = req.body.userFollow || user.userFollow;

      // Save the updated document back to the database
      user.save(function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(user);
        }
      });
    }
  });
});

//Search
app.post('/searching', function (req, res) {
  var body = req.body;
  var keySearchFormat = Diacritics.clean(body.keySearch.toLowerCase());
  Food.find(function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      var foodsReturn = [];
      foods.forEach(function (value) {
        var nameFormat = Diacritics.clean(value.name.toLowerCase());
        if (nameFormat.indexOf(keySearchFormat) > -1) {
          foodsReturn.push(value);
        }
      });
      res.json({ food: foodsReturn });
    }
  });
});

//Create Food
app.post('/createFood', function (req, res) {
  var body = req.body;

  // var idValue = body.id;
  var nameValue = body.name;
  var authorValue = body.author;
  var imageShowValue = body.imageShow;
  var typeValue = body.type;
  var timeValue = body.time;
  var setsValue = body.sets;
  var levelValue = body.level;
  var ratingValue = body.rating;
  var rateNumValue = body.rateNum;
  var materialValue = body.material;
  var cookValue = body.cook;
  var listRateValue = body.listRate;
  var authorNameValue = body.authorName;

  var food = new Food({
    // id:idValue,
    name: nameValue,
    author: authorValue,
    imageShow: imageShowValue,
    type: typeValue,
    time: timeValue,
    sets: setsValue,
    level: levelValue,
    rating: ratingValue,
    rateNum: rateNumValue,
    material: materialValue,
    cook: cookValue,
    listRate: listRateValue,
    authorName: authorNameValue
  });


  food.save(function (err, createdFood) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      res.json(createdFood);
    }
  }
  );
});

//Get Food
app.get('/getFood', function (req, res) {
  Food.find(function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send({ food: foods });
    }
  });
});


//GetTopFood
app.get('/getTopFood', function (req, res) {
  var mysort = { rating: -1 };
  Food.find().sort(mysort).exec(function (err, result) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ food: result });
    }
  });
});


//UpdateFood
app.put('/updateFood/:foodId', function (req, res) {
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

//Delete Food
app.delete('/deleteFood/:foodId', function (req, res) {
  var foodId = req.params.foodId;

  Food.findByIdAndRemove(foodId, function (error, food) {
    if (err) {
      res.json({ "success": 0, "message": "Could not delete data from mlab" });
    } else {
      res.json({ "success": 1, "message": "Delete succesfully" });
    }
  });
});

//GetFood by type
app.get('/getFoodByType/:typeFood', function (req, res) {
  var typeFood = req.params.typeFood;
  Food.find({ 'type': typeFood }, function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send({ food: foods });
    }
  });
});


//GetFood by id
app.get('/getFoodById/:idFood', function (req, res) {
  var idFood = req.params.idFood;
  Food.findById(idFood, function (err, food) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send(food);
    }
  });
});

//GetFood by user
app.get('/getFoodByUser/:userId', function (req, res) {
  var userId = req.params.userId;
  Food.find({ 'author': userId }, function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send({ food: foods });
    }
  });
});

//GetFavorite Food
app.get('/getFoodFavorite/:userId', function (req, res) {

  User.findOne({ 'idFb': req.params.userId }).populate('listFavorite').exec(function (err, userFound) {
    if (err)
      console.log('Error in view survey codes function');
    if (!userFound || userFound.listFavorite.length < 1)
      res.send('No favorite are yet added.');
    else
      res.send({ food: userFound.listFavorite });
  });
});
