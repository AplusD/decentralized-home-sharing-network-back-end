var sqlrequests = require('../lib/sql_requests.js');

const badResult = "{ \"RESULT\": 0 }";
const okResult = "{ \"RESULT\": 1 }";

var AccountAPI = function(){};

AccountAPI.prototype.setDb = function(db)
{
    AccountAPI.prototype.db = db; 
}

AccountAPI.prototype.auth = function (req, res) {
    if(req.query.userId == -1 || req.query.userToken == "none")
       return  res.send(badResult);

    AccountAPI.prototype.db.query(sqlrequests.SQL_AUTH_USER, [req.query.userId, req.query.userToken], function (error, result, fields) {
            if (error) return res.send(badResult);
            if(result[0][0].length == 0) return res.send(badResult);
            res.send(result[0][0]);
        });
};

AccountAPI.prototype.login = function (req, res) {
    AccountAPI.prototype.db.query(sqlrequests.SQL_LOGIN, [req.query.userEmail, req.query.userPassword], function (error, result, fields) {
       if(error) 
           return res.send(badResult);
       
        if(result[0][0] != null) {
               var obj = result[0][0];
               var token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
               obj.userToken = token;
               AccountAPI.prototype.db.query(sqlrequests.SQL_ADD_TOKEN_TO_LOGIN, [req.query.userEmail, req.query.userPassword, token], 
                        function (error, result, fields) {
                       res.send(JSON.stringify(obj));
            });
        }
        else 
               return res.send(badResult);
           
   });
};

AccountAPI.prototype.getUserInfo = function(req, res) {
    AccountAPI.prototype.db.query(sqlrequests.SQL_GET_USER_INFO, [req.query.userId], function (error, result, fields) {
       if(error) return res.send(badResult);
       res.send(JSON.stringify(result[0][0]));
    });
}; 


AccountAPI.prototype.getUserOfferings = function(req, res){
    AccountAPI.prototype.db.query(sqlrequests.SQL_GET_YOUR_OFFERINGS, [req.query.userId, req.query.userToken], function (error, result, fields) {
       if(error) return res.send(badResult);
        res.send(result[0]);
    });
};


AccountAPI.prototype.getUserTrips = function(req, res){
    AccountAPI.prototype.db.query(sqlrequests.SQL_GET_YOUR_TRIPS, [req.query.userId, req.query.userToken], function (error, result, fields) {
        if(error) return res.send(badResult);
         res.send(result[0]);
    });
};


AccountAPI.prototype.createAccount = function(req, res){
  var id = Math.floor(Math.random() * (1000 - 5)) + 5;
  AccountAPI.prototype. db.query(sqlrequests.SQL_REGISTRATION, [id,
         req.query.userName,  req.query.userSurname,  req.query.userEmail, req.query.userPhoneNumber + "", req.query.userPassword, 
            req.query.userBirthDay, req.query.userPublicKey, req.query.userDescription, req.query.userAvatar],  
            function(error, result, fields){
            if(error)  return res.send(badResult);
            res.send(okResult);
    });
};


module.exports = AccountAPI;