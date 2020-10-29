
var poolModule = require('generic-pool');
var mysql = require('mysql');
var config = require('config');
var mysqlConfig = config.get('mysql');
console.log("my config details :: " + config.get("name"));
var Pool = (function () {
	var pool = null; 
	const factory = {
        create : function(){
            return new Promise(function(resolve, reject){
  
                  var client = mysql.createConnection({
                    host: mysqlConfig.host,
                    database: mysqlConfig.database,
                    user: mysqlConfig.user,
                    password: mysqlConfig.password
                  });
                        client.connect(function (error) 
                        {
                            			if (error) {
                                            console.log('error in db', error);
                                            reject(error)
                                        }
                                        else
                                        {
                                            console.log("db connected");
                                            resolve(client)
                                        }	
                        });
              
              
            })
          },
        destroy:function(resource){
            return new Promise(function(resolve, reject){
                console.log("db connection closed");
              resolve(resource)
            })
          }
      }
	const config = {
        max: 4,
        min: 2
      }
	pool = poolModule.createPool(factory, config)
	
	return {
		getPool: function () {
           // console.log("my connection :: " +JSON.stringify(pool));
			return pool;
		}

	}
})()
module.exports = Pool;
