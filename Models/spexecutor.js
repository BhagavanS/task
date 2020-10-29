
var poolConstructor = require('./../Models');
var pool = poolConstructor.getPool();
module.exports = {
	execute: function (spname, spparameters, cb) {
		const resourcePromise = pool.acquire();
		resourcePromise.then(function(conn) {

			var stringize = 'Call ' + spname + '(?)';
			conn.query(stringize, [spparameters], function (er, results, fields) {
				if (er) {
					pool.release(conn);
					if (cb && typeof cb === 'function') {
						return cb(er);
					} else {
						throw new Error('Error!!! executing sp : ' + spname + ' : ' + er.message + ' : callback is not a function');
					}
				}
				if (cb && typeof cb === 'function') {
					pool.release(conn);
					return cb(er, results, fields);
				} else {
					pool.release(conn);
					throw new Error('callback is not a function');
				}
			});
			
		  })
		  .catch(function(err) {
			cb(err);
		  });
		
	},
	queryExecute: function (query, data, cb) {
        
            const resourcePromise = pool.acquire();
            resourcePromise.then(function(conn) {

            conn.query(query, [data], function (er, results, fields) {
                pool.release(conn);
                if (er) {
                    if (cb && typeof cb === 'function') {
                        return cb(er);
                    } else {
                        throw new Error('Error!!! executing query : ' + query + ' : ' + er.message + ' : callback is not a function');
                    }
                }
                if (cb && typeof cb === 'function') {
                    return cb(er, results, fields);
                } else {
                    throw new Error('callback is not a function');
                }
            });
        })
        .catch(function(err) {
			cb(err);
		  });
            
    },
	
};