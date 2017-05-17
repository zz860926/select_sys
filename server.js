var Koa = require('koa')
var Router = require('koa-router')
var logger = require('koa-logger')
var bodyParser = require('koa-bodyparser')
var koaStatic = require('koa-static')
var mongodb = require('mongodb')

var app = new Koa()
var router = new Router()
app.use(bodyParser())

var db,collection
var input = {}
var results = []
app.use(logger())

router
   .get('/', listPost)
   .get('/post/:id', getPost)
   .post('/post', searchdb)
 

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

async function searchdb (ctx) {
  console.log('createPost:rawBody=%s', ctx.request.rawBody)
  console.log('createPost:body=%j', ctx.request.body)
   input = ctx.request.body
  try{
       results = await collection.find(input).toArray()
        // for(var i = 0; i <=results.length;i++){
        //   results[i].id = i; 
        // }
      console.log(results);
    }catch(error){
        console.log(error)
     } 

  ctx.body =  JSON.stringify(results)
}

async function main () {
  db = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/mydb')
  collection = await db.collection('newdb')
  app.use(router.routes()).use(koaStatic('../')).listen(3000)
}

main()