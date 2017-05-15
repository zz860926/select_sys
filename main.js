
var content

async function main () {
   f6.route(/^$/, input)
       .route(/^post\/list/, list)
       .route(/^post\/(\w+?)/, show)
       .route(/^post/, search)
    await f6.onload(init)
}

 function init() {
   content = f6.one('#content')
 }

 async function input () {
   content.innerHTML = `
   <form>
    按人查詢：
   <p><input id="search_name" placeholder="請輸入人名。" name="姓名"></p>
   <p><input id="search_birthplace" placeholder="請輸入出生地。" name="出生地"></p>
      <p><input type="button" value="Search" onclick="search()"></p>
   </form>

 `
 }


 async function search () {
  try{
   var post = {
      姓名:f6.one('#search_name').value,
      出生地:f6.one('#search_birthplace').value,
      // 生年:f6.one('#search_birthyear').value
    }
    if(!post.姓名){delete post.姓名};
    if(!post.出生地){delete post.出生地};
   console.log(`search:post=${JSON.stringify(post)}`)
   await f6.ojax({method: 'POST', url: '/post'}, post)
 //  posts.push(post)

  //  await f6.go('post/list') // list #
  await list ()
  }catch(error){
    console.log(error.stack)
  } 
}

async function show (m) {
  var id = parseInt(m[1])//?
  var post = await f6.ojax({method: 'GET', url: `/post/${id}`})
  var postString = JSON.stringify(post)
  
  content.innerHTML =`
  <table border = "1">
  <tr>
  <th colspan ="4">查詢列表
  <tr>
  <th>姓名 <th>出生地 <th>生年 <th>卒年
  <tr>
  <td>${post.姓名}<td>${post.出生地}<td>${post.生年}<td>${post.卒年}
  </table>
  <input type="button" value="返回" onclick="location.href='http://localhost:3000/select_sys/main.html#post/list'">  
  `
}

async function list () {
  var posts = await f6.ojax({method: 'GET', url: '/'})
  console.log("posts="+posts)
  content.innerHTML =`
  <h1>查詢結果</h1>
  <p>有一個 <strong>${posts.length}</strong>查詢結果</p>
  <ul id="posts">
    ${posts.map(post => `
      <li>
        <p><a href="#post/${post._id}">${post.姓名}</a></p>
      </li>
    `).join('\n')}
  </ul>
  
   <input type="button" value="返回" onclick="location.href='http://localhost:3000/select_sys/main.html'">  
  `
}

// function f( value) {
//   if (typeof value === "number") {
//     value = 1 * value;
//   }
//   return value;
// }
main()