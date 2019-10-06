var sqlrequests = require('../lib/sql_requests.js');


const badResult = "{ \"RESULT\": 0 }";
const okResult = "{ \"RESULT\": 1 }";

var RentAPI = function(){};

RentAPI.prototype.setDb = function(db)
{
    RentAPI.prototype.db = db; 
}


RentAPI.prototype.addLodging = function(req, res){
    var id = Math.floor(Math.random() * (10000 - 50)) + 50;
 
    RentAPI.prototype.db.query(sqlrequests.SQL_ADD_HOUSE, [id, req.query.houseName, req.query.houseOrderType,  req.query.houseGuestCount,
            req.query.houseDescription,       req.query.houseAddress,  449, req.query.housePrice, req.query.userId,
            req.query.houseLat, req.query.houseLng],
                 function (error, result, fields){
                    if(error)   return res.send(badResult);
                    var result = {};
                    result.RESULT = 1; 
                    result.houseId = id; 
                    res.send(JSON.stringify(result));      
    });
}; 

 
RentAPI.prototype.addLodgingImg = function(req, res){
    RentAPI.prototype.db.query(sqlrequests.SQL_ADD_HOUSE_IMG, [req.query.houseId, req.query.imgPath], function(error, result, fields){
        if(error)   return res.send(badResult);
         res.send(okResult);
    });
}; 

RentAPI.prototype.updateMainLodgingImg = function(req, res){
    RentAPI.prototype.db.query(sqlrequests.SQL_UPDATE_MAIN, [req.query.houseId, req.query.imgPath], function(error, result, fields){
        if(error)   return res.send(badResult);
         res.send(okResult);
    });
}; 
 

RentAPI.prototype.publishLodging = function(req, res){
    RentAPI.prototype.db.query(sqlrequests.SQL_PUBLISH_HOUSE, [req.query.houseId], function(error, result, fields){
        if(error)   return res.send(badResult);
        res.send(okResult);
    });
}; 
 
 
RentAPI.prototype.getLodgingsTypes = function(req, res){
    RentAPI.prototype.db.query(sqlrequests.SQL_GET_HOUSETYPES, function (error, result, fields) {
        if(error)  return res.send(badResult);
        res.send(result[0]);
    })
}; 
 
module.exports = RentAPI;