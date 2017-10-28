var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'newDatabase',
        multipleStatements: true,
        debug    : false //set true if you wanna see debug logger
    },'request')
);

// ------------------------------------------------------------
// static pages

app.get('/404',function(req,res){
    res.render('404');
});

app.get('/faq',function(req,res){
    res.render('faq');
});

app.get('/about',function(req,res){
    res.render('about');
});

app.get('/sitemap',function(req,res){
    res.render('sitemap');
});

 app.get('/account-address',function(req,res){
    res.render('account-address');
});

app.get('/account-order',function(req,res){
    res.render('account-order');
});

app.get('/checkout',function(req,res){
    res.render('checkout');
});

app.get('/contact',function(req,res){
    res.render('contact');
});

app.get('/create-account',function(req,res){
    res.render('create-account');
});

app.get('/edit',function(req,res){
    res.render('edit');
});

app.get('/footer',function(req,res){
    res.render('footer');
});

app.get('/header',function(req,res){
    res.render('header');
});

app.get('/index',function(req,res){
    res.render('index');
});

app.get('/listing',function(req,res){
    res.render('listing');
});

app.get('/listing-empty-category',function(req,res){
    res.render('listing-empty-category');
});

app.get('/login-account',function(req,res){
    res.render('login-account');
});

app.get('/product-layout4',function(req,res){
    res.render('product-layout4');
});

app.get('/search',function(req,res){
    res.render('search');
});

app.get('/shopping-cart-empty',function(req,res){
    res.render('shopping-cart-empty');
});

app.get('/shopping-cart-right-column',function(req,res){
    res.render('shopping-cart-right-column');
});

app.get('/user',function(req,res){
    res.render('user');
});

app.get('/wishlist',function(req,res){
    res.render('wishlist');
});
// ------------------------------------------------------------

//RESTful route
var router = express.Router();

/*------------------------------------------------------
*  This is router middleware,invoked everytime we hit url
*  we can use this for doing validation,authetication
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});


// -----------------------------------------------------------------------------

var home = router.route('/');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/

home.all(function(req,res,next){
    console.log("You need to smth about home Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
home.get(function(req,res,next){

    // var user_id = req.params.user_id;
     // res.render('header',);

     req.getConnection(function(err,conn){

        var query = conn.query("SELECT Category_id,categoryName FROM category;SELECT Subcategory_id,subCategoryName,Category_id FROM Sub_Category",function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
           
            console.log(rows[0],rows[1]);
            res.render('index',{title:"subcategory name",categ:rows[0],subcateg:rows[1]});

          });

    });
});


// var subcategory= router.route('/:Category_id');

// subcategory.all(function(req,res,next){
//     console.log("You need to smth about home Route ? Do it here");
//     console.log(req.params);
//     next();
// });

//get data to update
// subcategory.get(function(req,res,next){

//      var Category_id = req.params.Category_id;
//      // res.render('header',);

//      req.getConnection(function(err,conn){

//         var subcateg = conn.query("SELECT Subcategory_id,subCategoryName FROM Sub_Category where Category_id = ? ",[Category_id],function(err,rows){
//             if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//             }

//             //if user not found
//             if(rows.length < 1)
//                 return res.send("User Not found");

//             res.render('index',{title:"subcategory name",subcateg:rows});
            
//         });

//     });
// });


var list = router.route('/:category/:subcategory');

list.all(function(req,res,next){
    console.log("You need to smth about list Route ? Do it here");
    console.log(req.params);
    next();
});
//show the CRUD interface | GET
list.get(function(req,res,next){

var category = req.params.category;
var subcategory = req.params.subcategory;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT Category_id,categoryName FROM category;SELECT Subcategory_id,subCategoryName,Category_id FROM Sub_Category;SELECT productName,product_id,subCategoryName,stock FROM Product NATURAL JOIN Sub_Category WHERE Category_id= ? and subCategory_id= ?;Select subCategoryName from Sub_Category WHERE subCategory_id = ? AND Category_id = ? ",[category,subcategory,subcategory,category],function(err,rows){
          console.log("vjhdfvsdvdsvs",rows[3]);
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            if(rows[2].length < 1)
                return  res.render('listing-empty-category',{title:"RESTful Crud Example",categ:rows[0],subcateg:rows[1],subv:rows[3]});
              else{ 
            res.render('listing',{title:"RESTful Crud Example",categ:rows[0],subcateg:rows[1],listin:rows[2],subk:rows[3]});}
         });

        var cart = conn.query("SELECT productName, newPrice, smallImage, quantity, (newPrice * quantity) as subtotal FROM Cart natural join Product WHERE Cart.email_id ="anujainbhav@gmail.com" ",function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('index',{title:"cart details",cart:rows});
            
        });

        var cart_total = conn.query("SELECT sum (newPrice * quantity) as total FROM Cart natural join Product WHERE Cart.email_id ="anujainbhav@gmail.com" ",function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('index',{title:"cart total",cart_total:rows});
            
        });



    });

});

// //update data
// home.put(function(req,res,next){
//     var user_id = req.params.user_id;

//     //validation
//     req.assert('name','Name is required').notEmpty();
//     req.assert('email','A valid email is required').isEmail();
//     req.assert('password','Enter a password 6 - 20').len(6,20);

//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }

//     //get data
//     var data = {
//         name:req.body.name,
//         emailId:req.body.email,
//         password:req.body.password
//      };

//     //inserting into mysql
//     req.getConnection(function (err, conn){

//         if (err) return next("Cannot Connect");

//         var query = conn.query("UPDATE t_user set ? WHERE user_id = ? ",[data,user_id], function(err, rows){

//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }

//           res.sendStatus(200);

//         });

//      });

// });

// //delete data
// home.delete(function(req,res,next){

//     var user_id = req.params.user_id;

//      req.getConnection(function (err, conn) {

//         if (err) return next("Cannot Connect");

//         var query = conn.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){

//              if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//              }

//              res.sendStatus(200);

//         });
//         //console.log(query.sql);

//      });
// });

var createAcc = router.route('/create-account');

createAcc.get(function(req,res,next){
  res.render('create-account');
});

createAcc.post(function(req,res,next){

    //server side validation*********
    req.assert('firstName','First Name is required').matches(/[^\s\\]/);
    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    req.assert('emailId','A valid email is required').isEmail();
    errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    req.assert('password','Enter a password 6 - 20').len(6,20);
    errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.firstName+req.body.lastName,
        emailId:req.body.emailId,
        password:req.body.password
     };

    //inserting into mysql
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO classroomshoppers.userdetail set ? ", data, function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

           res.sendStatus(200);
        });
     });
});

var loginAcc = router.route('/login-account');

loginAcc.get(function(req,res,next){
  res.render('login-account');
});

loginAcc.put(function(req,res,next){
  console.error("inside post--------------");

  req.assert('emailId','A valid email is required').isEmail();
  errors = req.validationErrors();
  if(errors){
      res.status(422).json(errors);
      return;
  }

  req.assert('password','Empty password not alllowed').notEmpty();
  errors = req.validationErrors();
  if(errors){
      res.status(422).json(errors);
      return;
  }

  var emailId = req.body.emailId;
  var password = req.body.password;

  req.getConnection(function(err,conn){
      if (err){
        console.log(err);
        return next("Cannot Connect");
      }

      var query = conn.query("SELECT name FROM classroomshoppers.userdetail WHERE emailId = '"+emailId+"' and password = '"+password+"' ", function(err,rows){
          if(err){
            console.log(err);
              return next("Mysql error, check your query");
          }
          if(rows.length==0)
            res.status(400).json("Invalid emailID - password");
          else
          res.status(200).json(rows[0].name);
       });
  });
});




// -----------------------------------------------------------------------------


// var curut = router.route('/user');
//
// //show the CRUD interface | GET
// curut.get(function(req,res,next){
//
//     req.getConnection(function(err,conn){
//
//         if (err) return next("Cannot Connect");
//
//         var query = conn.query('SELECT * FROM t_user',function(err,rows){
//
//             if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//             }
//
//             res.render('user',{title:"RESTful Crud Example",data:rows});
//
//          });
//
//     });
//
// });
// //post data to DB | POST
// curut.post(function(req,res,next){
//
//     //validation
//     req.assert('name','Name is required').notEmpty();
//     req.assert('email','A valid email is required').isEmail();
//     req.assert('password','Enter a password 6 - 20').len(6,20);
//
//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }
//
//     //get data
//     var data = {
//         name:req.body.name,
//         email:req.body.email,
//         password:req.body.password
//      };
//
//     //inserting into mysql
//     req.getConnection(function (err, conn){
//
//         if (err) return next("Cannot Connect");
//
//         var query = conn.query("INSERT INTO t_user set ? ",data, function(err, rows){
//
//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }
//
//           res.sendStatus(200);
//
//         });
//
//      });
//
// });
//
// // -----------------------------------------------------------------------------
//
// var curut2 = router.route('/user/:user_id');
//
// curut2.all(function(req,res,next){
//     console.log("You need to smth about curut2 Route ? Do it here");
//     console.log(req.params);
//     next();
// });
//
// //get data to update
// curut2.get(function(req,res,next){
//
//     var user_id = req.params.user_id;
//
//     req.getConnection(function(err,conn){
//
//         if (err) return next("Cannot Connect");
//
//         var query = conn.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){
//
//             if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//             }
//
//             //if user not found
//             if(rows.length < 1)
//                 return res.send("User Not found");
//
//             res.render('edit',{title:"Edit user",data:rows});
//         });
//
//     });
//
// });
//
// //update data
// curut2.put(function(req,res,next){
//     var user_id = req.params.user_id;
//
//     //validation
//     req.assert('name','Name is required').notEmpty();
//     req.assert('email','A valid email is required').isEmail();
//     req.assert('password','Enter a password 6 - 20').len(6,20);
//
//     var errors = req.validationErrors();
//     if(errors){
//         res.status(422).json(errors);
//         return;
//     }
//
//     //get data
//     var data = {
//         name:req.body.name,
//         email:req.body.email,
//         password:req.body.password
//      };
//
//     //inserting into mysql
//     req.getConnection(function (err, conn){
//
//         if (err) return next("Cannot Connect");
//
//         var query = conn.query("UPDATE t_user set ? WHERE user_id = ? ",[data,user_id], function(err, rows){
//
//            if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//            }
//
//           res.sendStatus(200);
//
//         });
//
//      });
//
// });
//
// //delete data
// curut2.delete(function(req,res,next){
//
//     var user_id = req.params.user_id;
//
//      req.getConnection(function (err, conn) {
//
//         if (err) return next("Cannot Connect");
//
//         var query = conn.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){
//
//              if(err){
//                 console.log(err);
//                 return next("Mysql error, check your query");
//              }
//
//              res.sendStatus(200);
//
//         });
//         //console.log(query.sql);
//
//      });
// });
//
// // -----------------------------------------------------------------------------

//now we need to apply our router here
app.use(router);

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);

});
