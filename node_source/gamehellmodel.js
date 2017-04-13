var mysql      = require('mysql');
var http = require("http");
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'csci3100'
});



var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//console.log(__dirname);
app.use(express.static(__dirname + '/html'));


app.post('/signup', function (req, res) {
 
  // connection.connect();

var post={
user_name:req.body.uname,
password:req.body.psw,
eng_name:req.body.uengname,
email:req.body.uemail,
tel_no:req.body.utel,
birthday:req.body.ubirthday,
signin:0
};
     connection.query('select count(*) as count from users where user_name=?',[req.body.uname], function(err, rows, fields) {
		 if (err) throw err;
			if(rows[0].count==0){
				console.log('signup successful');
		 
			     connection.query('insert into users set ?',post, function(err, rows, fields) {
					 if (err) throw err;
				 });
				 //console.log('signup successful');
				res.writeHead(200);
				res.end('1');
				return;
				 }
			else
				console.log('signup failed');
				res.writeHead(200);
				res.end('0');
				return;
		 });
		 
	/*
    connection.query('insert into users set ?',post, function(err, rows, fields) {
    if (err) throw err;

	});
	*/
    // connection.end();

})
	
app.post('/signin', function (req, res) {
 
  // connection.connect();

	var act=req.body;
	/*
	connection.query('select * from users where user_name=? and password=?',[act.uname,act.psw], function(err, rows, fields) {
   if (err) throw err; 


	});
	*/
   // connection.end();

	signin(signinhandleResult);
	var datapass={a:1,b:2,c:'hello'};
	

function signin(callback) {
    var result;

    connection.query('select user_name,user_id ,signin,count(*) as count from users where user_name=? and password=?',[act.uname,act.psw], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
			//update signin if count==1 username unique
            return callback(err);
        }
		if(rows[0].signin==1)
		{
			res.writeHead(200);
			res.end('2');//this user has already signin
			return;
		}
        // Do something with `rows` and `fields` and assign a value to ret.
		//console.log(rows[0].count);
		result=rows;
        callback(null, result);

		
    });

}

function signinhandleResult(err, result) {
    if (err) {
        // Just an example. You may want to do something with the error.
        console.error(err.stack || err.message);

        // You should return in this branch, since there is no result to use
        // later and that could cause an exception.
        return;
    }
	if(result[0].count==1)
		connection.query('update users set signin=1 where user_name=?',[result[0].user_name], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
			//update signin if count==1 username unique
            return callback(err);
        }
		});
	//console.log(result[0].count);
	res.writeHead(200, { 'Content-Type': 'application/json'});
	//res.write(JSON.stringify('hello'));
    res.end(JSON.stringify(result));

    // All your logic with the result.
}
})
	

	
app.post('/newest', function (req, res) {

  // connection.connect();




connection.query('select game_name,image_link from games where validation=1 order by release_date desc limit ?',parseInt(req.body.number), function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	res.writeHead(200, { 'Content-Type': 'application/json'});-
    res.end(JSON.stringify(rows));

    });

    // connection.end();

})	

	
app.post('/postproduct', function (req, res) {

var date=formatDate();
  // connection.connect();
	var secondhand=0;
if(req.body.secondhand=='yes')
	var secondhand=1;
	//console.log(req.body.product_name);
 connection.query('select game_id from games where game_name=? and validation=1',[req.body.product_name], function(err, rows, fields) {
					 if (err) {throw err; 
					 res.writeHead(200);
					 res.end('0');  
					 return;
					 }
					 else
					{
					if(rows[0] == null)
					{
					 //console.log('caleb');
					 res.writeHead(200);
					 res.end('2'); //2 means product name not in games database 1 success 0 fails due to other reason
					 return;
					}
					 var post={
						 product_name:req.body.product_name,
						 price:req.body.price,
						 second_hand:secondhand,
						 venue:req.body.venue,
						 user_id:req.body.user_id,
						 platform:req.body.platform,
						 post_date:date,
						 image_link:req.body.imagelink,
						 information:req.body.pinfo,
						 status:0,
						 game_id:rows[0].game_id
						 };
					 
					 connection.query('insert into products set ?',post, function(err, rows, fields) {
					 if (err) {throw err;
					 res.writeHead(200);
					 res.end('0');
					 return;
					 }
					 else{
					res.writeHead(200);
					res.end('1');
					return;
					 }
					 });
					 
					 }
				 });


    // connection.end();
 function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
})

app.post('/registergame', function (req, res) {

  // connection.connect();

var platform =req.body.platform;
var str = JSON.stringify(platform);
var platformstr=str.split(',');
platform=platformstr.join('/').replace('[','');
str=platform.replace(']','');
platform=str.replace(/"/g,'');
//console.log(platform);

var post={
author :req.body.author,
game_name :req.body.product_name,
release_date :req.body.releaseDate,
information :req.body.pinfo,
image_link :req.body.imagelink,
categories :req.body.categories,
platform :platform,
validation :0
};


connection.query('select * from games where game_name=?',[req.body.product_name], function(err, rows, fields) {
        if (err) {
			throw err; 
			res.writeHead(200);
			res.end('0');
			return;
            
        }
		if(rows[0]!=null)
		{
			res.writeHead(200);
			res.end('2'); //game has been registered
			return;
		}
		connection.query('insert into games set ?',post, function(err, rows, fields) {
        if (err) {
			throw err; 
			res.writeHead(200);
			res.end('0');
			return;
            
        }
		res.writeHead(200);
		res.end('1');
		return;
		});
    });


    // connection.end();

})	
	
app.post('/searchgame', function (req, res) {
// console.log(req.body.game_name);
 var str=req.body.game_name+'%';
 connection.query('select game_name from games where validation=1 and game_name like ?',[str], function(err, rows, fields) {
        if (err) {
			throw err; 
			res.writeHead(200);
			res.end('0');
			return;
            
        }
		//console.log(rows);
		if(rows[0]==null)
		{
			res.writeHead(200);
			res.end('2'); //no matching game
			return;
		}
		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		return;
		
    });

})
	
app.post('/logout', function (req, res) {

  connection.query('update users set signin=0 where user_id=?',[req.body.user_id], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  }
			res.writeHead(200);
			res.end('0');
		
    });


})	
	
	
app.post('/getproducts', function (req, res) {

  
  var gamename=req.body.searchname+'%';
  var offsetnumber=(parseInt(req.body.page)-1)*12;
  connection.query('select count(*) as count from products where status=0 and product_name like ?',[gamename], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
	var	data=rows[0].count;
  connection.query('select * from products where status=0 and product_name like ? limit 12 offset ?',[gamename,offsetnumber], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
  if(rows[0]==null)
  {
  res.writeHead(200);
  res.end('2'); //empty result
  return;
  }

		//console.log(rows);
		res.writeHead(200, { 'Content-Type': 'application/json'});
		rows[0].searchname=req.body.searchname;
		rows[0].count=data;	//add count property to first row of the result where count=number of products
		res.end(JSON.stringify(rows));
		return;

    });

	});
})
	
app.post('/getpersonalinfo', function (req, res) {

  connection.query('select * from users where user_id=?',[req.body.user_id], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		return;
		
    });


})	
	
app.post('/changeinfo', function (req, res) {

  connection.query('select * from users where user_id=? and password=?',[req.body.user_id,req.body.opsw], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  if(rows[0]==null)
  {
	res.writeHead(200);
    res.end('2'); //wrong old password
	return;
  }
  var sql='update users set ';
  var count=0;
  if(req.body.psw!=''){
	  sql+='password='+connection.escape(req.body.psw);
	  count++;
  }
  if(req.body.utel!=''){
	  if(count!=0)
		  sql+=' , ';
	  sql+='tel_no='+connection.escape(req.body.utel);
	  count++;
  }
  if(req.body.uemail!=''){
	  if(count!=0)
		  sql+=' , ';
	  sql+='email='+connection.escape(req.body.uemail);
	  count++;
  }
  
  sql+=' where user_id='+connection.escape(req.body.user_id);
  connection.query(sql, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }

	res.writeHead(200);
    res.end('1'); //update successfully
	return;
  });
  
  });


})	
	
	
app.post('/platformsearch', function (req, res) {
  

  var offsetnumber=(parseInt(req.body.page)-1)*12;
  connection.query('select count(*) as count from products where status=0 and platform=?',[req.body.platform], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
  var data=rows[0].count;
  connection.query('select * from products where status=0 and platform = ? limit 12 offset ?',[req.body.platform,offsetnumber], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
  if(rows[0]==null)
  {
  res.writeHead(200);
  res.end('2'); //empty result
  return;
  }

		
		res.writeHead(200, { 'Content-Type': 'application/json'});
		rows[0].count=data;	//add count property to first row of the result where count=number of products
		res.end(JSON.stringify(rows));
		return;

    });

	});
  



})

	
app.post('/searchbygenre', function (req, res) {
  

  var offsetnumber=(parseInt(req.body.page)-1)*12;
  connection.query('select count(*) as count from products p,games g where p.game_id=g.game_id and g.categories=?',[req.body.genre], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
  var data=rows[0].count;
  connection.query('select p.*,g.categories from products p,games g where p.game_id=g.game_id and g.categories=? limit 12 offset ?',[req.body.genre,offsetnumber], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
  if(rows[0]==null)
  {
  res.writeHead(200);
  res.end('2'); //empty result
  return;
  }

		
		res.writeHead(200, { 'Content-Type': 'application/json'});
		rows[0].count=data;	//add count property to first row of the result where count=number of products
		res.end(JSON.stringify(rows));
		return;

    });

	});
  



})

	
	
app.post('/productgetinfo', function (req, res) {
  

  
  connection.query('select u.user_name,p.*,g.information as game_information from products p,games g ,users u where u.user_id=p.user_id and p.game_id=g.game_id and p.product_id=?',[req.body.product_id], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		return;
	});
  



})
	
app.post('/buyproduct', function (req, res) {
   function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

	var date=formatDate();
	//check whether product is on sale
  connection.query('select status from products p where p.product_id=?',[req.body.product_id], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }

	if(rows[0].status!=0)
	{
	res.writeHead(200);
	res.end('3');   //this product has been sold
	return;
    }

  
  connection.query('select p.*,g.categories from products p,games g where p.game_id=g.game_id and p.product_id=?',[req.body.product_id], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  if(req.body.user_id==rows[0].user_id)
  {
  res.writeHead(200);
  res.end('2');//buyer=seller
  return;  
  }
var post={
product_id:req.body.product_id,
buyer_id:req.body.user_id,
seller_id:rows[0].user_id,
transaction_date:date,
categories:rows[0].categories,
platform:rows[0].platform,
product_name:rows[0].product_name
};
  connection.query('insert into transaction set ?',post, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
    connection.query('update products set status=1 where product_id=?',[req.body.product_id], function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  res.writeHead(200);
  res.end('1');
  return;
	});
	
	});
	
	});
  	});



})
	
	
app.post('/recommend', function (req, res) {
  var sql1='select count(*) as count from (';
  var sql2='select t.product_name, g.image_link ';
  var sql=' from games g,transaction t where g.game_name=t.product_name ';
	  if(req.body.user_id!=null)
	  sql+='and buyer_id='+req.body.user_id;
  sql+= ' group by t.product_name order by count(t.product_name) desc ';
  if(req.body.number!=null)
	  sql+='limit '+req.body.number;
  if(req.body.page!=null)
	{
	var offsetnumber=(parseInt(req.body.page)-1)*12;
	sql+=' offset '+connection.escape(offsetnumber);
	}
  sql2+=sql;
  sql1+=sql2+' ) a';

  connection.query(sql1, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
    var count=rows[0].count;

	  connection.query(sql2, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
    if(rows[0]==null)
  {
  res.writeHead(200);
  res.end('2'); //empty result
  return;
  }
  rows[0].count=count;

		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		return;
	});
	});
  



})

	
	

app.post('/addvideo', function (req, res) {
  
	
  connection.query('select game_id,user_id from products where product_id=?',[req.body.product_id] ,function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }

  var game_id=rows[0].game_id;
  var user_id=rows[0].user_id;
  var post={
link :req.body.videolink,
user_id :user_id,
game_id:game_id
		
  };
   connection.query('insert into share_video set ?',post ,function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  res.writeHead(200);
  res.end('1');  //upload successfully
  return;

	 

	});

	 

	});


})
	
app.post('/getvideolink', function (req, res) {
  
	
  connection.query('select p.video_id,s.link from product_display_video p,share_video s where p.video_id =s.video_id  and product_id=?',[req.body.product_id] ,function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  if(rows[0]==null)
  {//insert random video then output link
  connection.query('select s.video_id from products p,games g,share_video s where s.game_id=g.game_id and p.game_id =g.game_id  and p.product_id=?',[req.body.product_id] ,function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  if(rows[0]==null){
  res.writeHead(200);
  res.end('2'); //no game video in database
  return;  
  }
  var post={
product_id:req.body.product_id,
video_id:rows[0].video_id
  };
  connection.query('insert into product_display_video set ?',post ,function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
    connection.query('select p.video_id,s.link from product_display_video p,share_video s where p.video_id =s.video_id  and product_id=?',[req.body.product_id] ,function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  return;
  }
  	res.writeHead(200, { 'Content-Type': 'application/json'});
	res.end(JSON.stringify(rows));
	return;  
	});  
  

	});  

	 

	});
  }
  else
  {
	res.writeHead(200, { 'Content-Type': 'application/json'});
	res.end(JSON.stringify(rows));
	return;  
	  
  }

	 

	});


})

	
app.post('/cvideo_getvideo', function (req, res) {
  
var sql='select s.link from share_video s,products p where s.game_id=p.game_id and p.game_id=(select game_id from products where product_id='+connection.escape(req.body.product_id)
+') ';
if(req.body.myvideo==1)
	sql+=' and s.user_id=(select user_id from products where product_id='+connection.escape(req.body.product_id)+')';
sql+=' group by s.link';

  connection.query(sql, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }

  if(rows[0]==null){

  res.writeHead(200);
  res.end('2'); //empty
  return;
  }
		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		return;
	});
  



})
	
app.post('/choosevideo', function (req, res) {
  


	
  connection.query('update product_display_video set video_id=(select video_id from share_video where link=?) where product_id=?',
  [req.body.videoRadio,req.body.product_id],function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }

  res.writeHead(200);
  res.end('1');
	});
  



})
	
app.post('/getmorenewest', function (req, res) {

var offsetnumber=(parseInt(req.body.page)-1)*12;
connection.query('select game_name,image_link,count from games,(select count(*) as count from games) u where validation=1 order by release_date desc'+ 
' limit 12 offset ?',offsetnumber, function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));

    });
	
    // connection.end();

})	
	
app.post('/myrecord_sell', function (req, res) {


connection.query('select * from products p where user_id=?',[req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));

    });
	
    // connection.end();

})
	
app.post('/myrecord_buy', function (req, res) {


connection.query('select * from transaction where buyer_id=?',[req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));

    });
	
    // connection.end();

})
	
app.post('/sendmessage', function (req, res) {
   function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

	var date=formatDate();
var post={
sender_id:req.body.sender_id,
reciever_id:req.body.user_id,
message:req.body.usercomment,
date:date
};
connection.query('insert into message set ?',post, function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
  res.writeHead(200);
  res.end('1');
    });
	
    // connection.end();

})
app.post('/getmessage', function (req, res) {


connection.query('select s.user_name sender_name,r.user_name reciever_name,m.* from users s,users r,(select * from message where sender_id=? or reciever_id=? ) m '+
'where s.user_id=m.sender_id and r.user_id=m.reciever_id order by m.date asc',[req.body.user_id,req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }

	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));

    });
	
    // connection.end();

})

	
app.post('/rategame', function (req, res) {

connection.query('select * from give_rate where user_id=? and product_id=?',[req.body.user_id,req.body.product_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
		
		if(rows[0]!=null){
			res.writeHead(200);
			res.end('2');  //already rated
			return;
		}
    
	
    // connection.end();


var post={
user_id:req.body.user_id,
product_id :req.body.product_id,
rate:req.body.rate
	
}

connection.query('insert into give_rate set ?',post, function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
			res.writeHead(200);
			res.end('1');  // rate success
			return;
    });
	});
    // connection.end();

})
	
	
app.post('/getrate', function (req, res) {


connection.query('select count(*) count,sum(g.rate) ratesum,p.user_id as seller from give_rate g,products p where g.product_id=p.product_id and p.user_id=?',[req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }

		if(rows[0].count==0){
			res.writeHead(200);
			res.end('2');  // no one rate the users
			return;			
			
		}
	
	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));
	
    });
	
    // connection.end();

})
	
	
app.post('/commentform', function (req, res) {
function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

	var date=formatDate();
	if(req.body.usercomment.length>300)
	{
	res.writeHead(200);
	res.end('2');  // over word limit
	return;	
		
	}
var post={
product_id :req.body.product_id,
user_id :req.body.user_id,
comment :req.body.usercomment,
date:date
}
connection.query('insert into comment_to_product set ?',post, function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }

			res.writeHead(200);
			res.end('1');  // success
			return;	
	
    });
	
    // connection.end();

})
	
app.post('/getcomment', function (req, res) {


connection.query('select u.user_name,c.* from users u,(select * from comment_to_product where product_id=?) c where u.user_id=c.user_id',[req.body.product_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }

	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));
	
    });
	
    // connection.end();

})
	
app.post('/follow', function (req, res) {
function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

	var date=formatDate();
	
connection.query('select * from follow where follower_id=? and followee_id=?',[req.body.follower_id,req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	if(rows[0]!=null)
		{
		connection.query('delete from follow where follower_id=? and followee_id=?',[req.body.follower_id,req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	
			res.writeHead(200);
			res.end('2');  // unfollow
			return;	
	
    });
			
			
		}
		else{
var post={
follower_id:req.body.follower_id,
followee_id:req.body.user_id,
follow_date:date
	
};
connection.query('insert into follow set ?',post, function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	
			res.writeHead(200);
			res.end('1');  // follow
			return;	
	
    });
		}
    });
    // connection.end();

})
	
app.post('/checkfollow', function (req, res) {



	
connection.query('select * from follow where follower_id=? and followee_id=?',[req.body.follower_id,req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	if(rows[0]!=null)
		{
			res.writeHead(200);
			res.end('2');  // unfollow
			return;		
			
		}
		else
		{
			res.writeHead(200);
			res.end('1');  // follow
			return;	
			
		}
    });
    // connection.end();

})
	
app.post('/getfollowing', function (req, res) {



	
connection.query('select u.user_name user_name,f.* from users u,(select * from follow where follower_id=?) f where f.followee_id=u.user_id '
,[req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
	console.log(rows);

	if(rows[0]==null)
		{
			res.writeHead(200);
			res.end('2');  // empty
			return;				
			
		}
		else{
	res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(rows));
		}
		    });
})
	
app.post('/checkadmin', function (req, res) {



	
connection.query('select count(*) as count from admin where admin_id =?',[req.body.user_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }


	if(rows[0].count==0)
		{
			res.writeHead(200);
			res.end('0');  // not admin
			return;				
			
		}
		else{
			res.writeHead(200);
			res.end('1');  // admin
			return;		
		}
		    });
})
	
app.post('/getgame', function (req, res) {



	
connection.query('select * from games where validation =0', function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }


	if(rows[0]==null)
		{
			res.writeHead(200);
			res.end('0');  //all games are validated
			return;				
			
		}
		else{

		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		}
		    });
})
	
app.post('/getgamevalidform', function (req, res) {



	
connection.query('select * from games where game_id =?',[req.body.game_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		
		    });
})
	
app.post('/validgame', function (req, res) {



	
connection.query('update games set validation=1 where game_id=?',[req.body.game_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
			res.writeHead(200);
			res.end('1');  //success
			return;				
			
		
		    });
})
	
	
app.post('/nvalidgame', function (req, res) {



	
connection.query('update games set validation=0 where game_id=?',[req.body.game_id], function(err, rows, fields) {
        if (err) {
			throw err; 
            // You must `return` in this branch to avoid using callback twice.
        }
			res.writeHead(200);
			res.end('1');  //success
			return;				
			
		
		    });
})
	
app.post('/recommend1', function (req, res) {
  var sql1='select count(*) as count from (';
   var sql2='select g.game_name,g.image_link ';
var sql = 'from games g,(select categories from (select count(*) count2,categories from transaction where buyer_id='+req.body.user_id+' group by categories) a'
+' where count2=(select max(count1) from (select count(*) count1 from transaction where buyer_id='+req.body.user_id+' group by categories) u)) h where g.validation=1 and g.categories=h.categories '
  if(req.body.number!=null)
	  sql+='limit '+req.body.number;
  if(req.body.page!=null)
	{
	var offsetnumber=(parseInt(req.body.page)-1)*12;
	sql+=' offset '+connection.escape(offsetnumber);
	}
  sql2+=sql;
  sql1+=sql2+' ) a';
	console.log(sql2);
  connection.query(sql1, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
    var count=rows[0].count;

	  connection.query(sql2, function(err, rows, fields) {
  if (err) 
  {
  throw err; 
  res.writeHead(200);
  res.end('0');
  }
    if(rows[0]==null)
  {
  res.writeHead(200);
  res.end('2'); //empty result
  return;
  }
  rows[0].count=count;

		res.writeHead(200, { 'Content-Type': 'application/json'});
		res.end(JSON.stringify(rows));
		return;
	});
	});
  



})
http.createServer(app).listen(8000);


