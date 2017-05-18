
var content

async function main () {
   f6.route(/^$/, input)
       .route(/^post\/list/, list)
       .route(/^post\/(\w+)/, table)
       .route(/^post/, search)
    await f6.onload(init)
}

 function init() {
   content = f6.one('#content')
 }

 async function input () {
   content.innerHTML =`
  <div class= "content">
  <div class ="leftContent" >
     <form>
    按人查詢：
   <p><input id="search_name" placeholder="請輸入人名。" name="姓名"></p>
   <p><input id="search_birthplace" placeholder="請輸入出生地。" name="出生地"></p>
      <p><input type="button" value="Search" onclick="search()"></p>
   </form>
   </div>
`
 }


 async function search () {
  try{
   var search = {
      姓名:f6.one('#search_name').value,
      出生地:f6.one('#search_birthplace').value,
    }
    if(!search.姓名){delete search.姓名};
    if(!search.出生地){delete search.出生地};
  //  console.log(`search:post=${JSON.stringify(post)}`)
   await f6.ojax({method: 'POST', url: '/post'}, search)
   // await list()
  //  alert('before') 
   await f6.go('post/list') // list #
  //  alert('after')
  }catch(error){
    console.log(error.stack)
  } 
}

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
      <p><input type="button" value="Search" onclick="search()"></p>
   </form>
   </div>
<div class ="rightContent">
  <h1>查詢結果</h1>
  <p>有一個 <strong>${posts.length}</strong>查詢結果</p>
  <ul id="posts">
    ${posts.map(post => `
      <li>
        <p><a href="#post/${post._id}">${post.姓名}</a></p>
      </li>
    `).join('\n')}
  </ul> 
  </div>
  <div class="clearFloat"></div>
  </div>
  `
}

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
  <input type="button" value="返回" onclick="location.href='http://localhost:3000/select_sys/main.html'">  
  `
}

main()