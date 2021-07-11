const mysql=require('mysql2');

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    database:'headth2',
    password:'headth'
});
//comment added
module.exports=pool.promise();
//http://localhost/phpmyadmin/server_databases.php?server=1
//http://localhost/phpmyadmin/db_structure.php?server=1&db=headth
//http://localhost/phpmyadmin/db_structure.php?server=1&db=headth
