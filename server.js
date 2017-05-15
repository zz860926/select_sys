var MongoClient = require('mongodb').MongoClient; 
var DB_CONN_STR = 'mongodb://localhost:27017/mydb'; 

var Koa = require('koa')
var Router = require('koa-router')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser')
var koaStatic = require('koa-static')

var app = new Koa()
var router = new Router()
app.use(bodyParser())


var posts = {}
var results
app.use(logger())

router
   .get('/', listPost)
   .get('/post/:id', getPost)
   .post('/post', createPost)
 
 async function selectData  (db) {  
    //连接到表  
    var collection = db.collection('newdb');
    //查询数据
    var whereStr = posts;
    var result = await collection.find(whereStr).toArray()
    results = result
       for(var i = 0; i <=results.length;i++){
         results[i]._id =i; 
       }
     
      console.log(result);
      db.close(); 
  
}

async function listPost (ctx) {
  ctx.body = JSON.stringify(results);  
}

async function getPost (ctx) {
  var id = parseInt(ctx.params.id)
  // console.log('getpost: id=%d posts=%j', id, results)
  var post = results[id]
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.body = await JSON.stringify(post)
}

async function createPost (ctx) {
  console.log('createPost:rawBody=%s', ctx.request.rawBody)
  console.log('createPost:body=%j', ctx.request.body)
  var post = ctx.request.body
    posts = post

MongoClient.connect(DB_CONN_STR, function(err, db) {
      if(err){return console.dir(err);}
     selectData(db)
   });


  //  var id = posts.push(post) - 1
  // post.id = id
  ctx.body =  JSON.stringify(post)
}

app.use(router.routes()).use(koaStatic('../')).listen(3000)