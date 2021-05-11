var request = require('supertest');
var app = require('../app.js');
const mysql=require('mysql2');

describe('GET /', function() {
 it('respond with hello world', function(done) {
  //navigate to root and check the response is "hello world"
  request(app).get('/').expect('hello world', done);
 });
});

//describe('Access to DB', function(){
//   describe('#fail', function(){
//        it('should return -1 because wrong credentials', function(done){
//            var connection = mysql.createConnection({
//                host: 'localhost',
//                user: 'root',
//                password: 'headth',
//                database: 'headth2'
//            });
//            connection.connect(done);
//        });
//    })
//});
