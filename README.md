# 網頁版檢索系統(select_sys)
## 簡介
此網頁為搜索人名的程式練習，主要參考課堂上教授的範例去改寫的
教授課堂範例f6 https://github.com/ccc-js/f6/blob/master/f6.js

主要程式為<b>網頁端main.html、伺服器端server.js</b>
網頁端負責網頁的轉換，伺服器端處理資料庫的搜尋

>main.html會去使用f6.js、main.js
insert.js 把資料內容匯到資料庫時才要用

## 安裝
``` 
    $ git clone https://github.com/zz860926/select_sys.git
    $ cd select_sys 
    $ npm install
```
## 匯資料到mongodb(mongodb要先開起來)
```
    $ node insert.js
```
## 執行
```
   $ node server.js
```

The server started at 
http://localhost:3000/select_sys/main.html

<img src="image/search.png" width="300">

## 細節講解
###　第一階段
<b>網頁端main.html</b>
```js
async function main () {
   f6.route(/^$/, input)
       .route(/^list/, list)
       .route(/^table\/(\w+)/, table)
       .route(/^search/, search)
    await f6.onload(init)
}
```
一開始還沒查詢時，url為更目錄，所以執行<b>input</b>
```js
async function input () {
   content.innerHTML =`
  <div class= "content">
  <div class ="leftContent" >
     <form>
    按人查詢：
   <p><input id="search_name" placeholder="請輸入人名。" name="姓名"></p>
   <p><input id="search_birthplace" placeholder="請輸入出生地。" name="出生地"></p>
   <p><input id="search_birthyear" placeholder="請輸入生年。" name="生年"></p>
   <p><input id="search_dieyear" placeholder="請輸入卒年。" name="卒年"></p>
      <p><input type="button" value="Search" onclick="search()"></p>
   </form>
   </div>
`
 }
```
### 第二階段
輸入想查詢的內容: <b>丁</b>

<img src="image/search_detail.png" width="300">

如果搜尋search點擊下去會執行
```js
 async function search () {
  try{
   var search = {
      姓名:{"$regex":".*"+f6.one('#search_name').value+".*"},
      出生地:f6.one('#search_birthplace').value,
      生年:parseInt(f6.one('#search_birthyear').value),
      卒年:parseInt(f6.one('#search_dieyear').value)
    }

    if(!search.姓名){delete search.姓名};
    if(!search.出生地){delete search.出生地};
    if(!search.生年){delete search.生年};
    if(!search.卒年){delete search.卒年};
  //  console.log(`search:post=${JSON.stringify(search)}`)
   await f6.ojax({method: 'POST', url: '/post'}, search)
   // await list()
   await f6.go('list') // list #
  }catch(error){
    console.log(error.stack)
  } 
}
```
```js
await f6.ojax({method: 'POST', url: '/post'}, search)
```
這其中會把表格裡的內容傳到<b>server</b>端(server.js)去查詢，在cmd可以看到一下紀錄

<img src="image/postcmd1.png" width="300">

>server端做的事等下會再補充

回傳完server後再執行list
```js
  await f6.go('list') // list #
```
```js
async function list () {
  var posts = await f6.ojax({method: 'GET', url: '/'})
  console.log("posts="+posts)
  content.innerHTML =`
  <div class= "content">
  <div class ="leftContent" >
     <form>
    按人查詢：
   <p><input id="search_name" placeholder="請輸入人名。" name="姓名"></p>
   <p><input id="search_birthplace" placeholder="請輸入出生地。" name="出生地"></p>
   <p><input id="search_birthyear" placeholder="請輸入生年。" name="生年"></p>
   <p><input id="search_dieyear" placeholder="請輸入卒年。" name="卒年"></p>
      <p><input type="button" value="Search" onclick="search()"></p>
   </form>
   </div>
<div class ="rightContent">
  <h1>查詢結果</h1>
  <p>有一個 <strong>${posts.length}</strong>查詢結果</p>
  <ul id="posts">
    ${posts.map(post => `
      <li>
        <p><a href="#table/${post._id}">${post.姓名}</a></p>
      </li>
    `).join('\n')}
  </ul> 
  </div>
  <div class="clearFloat"></div>
  </div>
  `
}
```
```html
<div class ="rightContent">
  <h1>查詢結果</h1>
  <p>有一個 <strong>${posts.length}</strong>查詢結果</p>
  <ul id="posts">
    ${posts.map(post => `
      <li>
        <p><a href="#table/${post._id}">${post.姓名}</a></p>
      </li>
    `).join('\n')}
  </ul> 
  </div>
```
posts會去server抓取結果然後印在網頁上

--------------------------
#### 來查看server.js做了甚麼事
server.js
```js
router
   .get('/', listPost)
   .get('/post/:id', getPost)
   .post('/post', searchdb)
```
剛網頁端查詢時呼叫server的內容方法為POST，url為/post
```js
await f6.ojax({method: 'POST', url: '/post'}, search)
```
對應server端的路由/post會觸發<b>searchdb</b>
```js
async function searchdb (ctx) {
  console.log('createPost:rawBody=%s', ctx.request.rawBody)
  console.log('createPost:body=%j', ctx.request.body)
   input = ctx.request.body
  try{
       results = await collection.find(input).toArray()
      // console.log(results);
    }catch(error){
        console.log(error)
     } 

  ctx.body =  JSON.stringify(input)
}
```
```js
results = await collection.find(input).toArray()
```
這指令會去搜尋資料庫，並把查詢完的結果會放在results全域變數裡

---------------------------
### 第三階段

例如點擊連結 <b>丁瑞圖</b>

<img src="image/touchlink.png" width="500">

就會顯示更多內容

點擊連結時的程式碼
```js
<p><a href="#table/${post._id}">${post.姓名}</a></p>
```
點擊後會跳轉到這頁面
http://localhost:3000/select_sys/main.html#table/604c51957de15c39e453f0fa

table/604c51957de15c39e453f0fa
依照網頁端的程式就會執行<b>table</b>的函數
```js
async function main () {
   f6.route(/^$/, input)
       .route(/^list/, list)
       .route(/^table\/(\w+)/, table)
       .route(/^search/, search)
    await f6.onload(init)
}
```
```js
async function table (m) {
  var id = m[1]
  var show = await f6.ojax({method: 'GET', url: `/post/${id}`})
  
  content.innerHTML =`
  <table border = "1">
  <tr>
  <th colspan ="4">查詢列表
  <tr>
  <th>姓名 <th>出生地 <th>生年 <th>卒年
  <tr>
  <td>${show.姓名}<td>${show.出生地}<td>${show.生年}<td>${show.卒年}

  </table>
  <input type="button" value="返回" onclick="location.href='http://localhost:3000/select_sys/main.html#list'">  
  `
}
```
這裡又會抓起server端的資料
會執行
```js
async function getPost (ctx) {
  try{
    var id = ctx.params.id
    //  console.log('getpost: id=%s results=%j', id, results)
    var post
    for(var i = 0; i<results.length; i++){
      var _id = results[i]._id
      if(_id == id){
      post = results[i]
      }
    }
    if (!post) ctx.throw(404, 'invalid post id')
    ctx.body = await JSON.stringify(post)
  }catch(error){
    console.log(error)
  }
}
```
抓起到該人士在results的第幾個人之後，再把該人士詳細資料成列出來