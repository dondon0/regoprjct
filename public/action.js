const db= mysql.createConnection({
    host: process.env.DATABASE_HOST, /*or ip address of server*/
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

let button=document.getElementsByName('test');
let msg='test btn works';

let item=button.parentElement;
let id=item.getElementsByClassName('pid')[0].innerText
// button.addEventListener('click',()=>{
//     db.query('delete from products where productid=?',[id],(err,res)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             alert("Item deleted, please refresh page.");
//         }
//     })
// })

button.addEventListener('click', ()=>{
    alert(msg);

})
