var sqlrequests = require('../lib/sql_requests.js');

var imageLoader = require('./image_loader'); 

const crypto = require('crypto');
const Tx = require('ethereumjs-tx');
var blockchainConst = require('../lib/blockchain_constants');
var blockchainFunction = require('../lib/blockchain_function');

const badResult = "{ \"RESULT\": 0 }";
const okResult = "{ \"RESULT\": 1 }";

var LeaseAPI = function(){};

LeaseAPI.prototype.setDb = function(db)
{
    LeaseAPI.prototype.db = db; 
}

LeaseAPI.prototype.setWeb3 = function(web3, homeSharingContract)
{
    LeaseAPI.prototype.web3 = web3;
    LeaseAPI.prototype.homeSharingContract = homeSharingContract; 
}

LeaseAPI.prototype.getLodgings = function (req, res) {
    LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_LEASES, function (error, result, fields) {
        if(error)  return res.send(badResult);
        res.send(result[0]);
    });
};


LeaseAPI.prototype.checkHouse = function (req, res) {
    LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_LODGING_CONTRACT, [req.query.houseId], function(error, result, fields){
        if(error)   return res.send(badResult);
        res.send(result[0]);
    });
};


LeaseAPI.prototype.getLodgingsLocations = function(req, res) {
    LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_LEASESLOCATION, function (error, results, fields) {
        if(error)   return res.send(badResult);
        res.send(results[0]);
    }); 
};


LeaseAPI.prototype.getLodgingInfo = function(req, res){
    var houseInfo = {};
    
    LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_HOUSE_FULLPLACE, [req.query.cityCode], function (error, result, fields) {
        if(error)   return res.send(badResult);
        houseInfo.place = result[0][0];

        LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_HOUSE_LOCATION, [req.query.houseId], function (error, result, fields) {
            if(error)  return res.send(badResult);
            houseInfo.location = result[0][0];

            LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_HOST_INFO, [req.query.userId], function (error, result, fields) {
                if(error)  return res.send(badResult);
                houseInfo.hostInfo = result[0][0];

                LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_LODGING_PHOTOS, [req.query.houseId], function (error, result, fields) {
                    if(error) return res.send(badResult);

                    houseInfo.lodgingPhotos = result[0];
                    res.send(JSON.stringify(houseInfo));
                })
            })
        });
    });
};
 


LeaseAPI.prototype.getChat = function(req, res){
    LeaseAPI.prototype.db.query(sqlrequests.SQL_GET_CHAT,  [req.query.contractId], function(error, result, fields){
        if(error) return res.send(badResult);
        res.send(result[0]);
    });
};

LeaseAPI.prototype.sendMsg = function(req, res){
    
    var id = Math.floor(Math.random() * (110000 - 5)) + 5;

    LeaseAPI.prototype.db.query(sqlrequests.SQL_SEND_MSG, [id, req.query.contractId, req.query.userId,  req.query.msg], function(error, result, fields){
        if(error)  return res.send(badResult);
        else res.send(okResult);
    }); 
};

LeaseAPI.prototype.startContract = function(req, res){
    
    var id = Math.floor(Math.random() * (10000 - 50)) + 50;
    
    LeaseAPI.prototype.db.query(sqlrequests.SQL_START_CONTRACT,[req.query.houseId, id, req.query.guestId,
         req.query.guestsCount, req.query.dateFrom, req.query.dateTo,   req.query.price, req.query.pricewei, req.query.msg, "status1"],
          function (error, result, fields) {
            if(error)  return res.send(badResult);
            res.send(okResult);                 
    });
}; 
 

LeaseAPI.prototype.updateContractStatus = function(req, res){

    var hash = crypto.createHash('md5').update(req.query.houseId + req.query.dateFrom + req.query.dateTo).digest('hex');

    const private_key = new Buffer(blockchainConst.ETHEREUM_DEFAULT_PRIVATE_KEY, 'hex');
    const method =  LeaseAPI.prototype.homeSharingContract.addTransacation.getData(hash, req.query.contractId,
             req.query.partnerWallet, req.query.houseId, req.query.dateFrom, req.query.dateTo, req.query.pricewei + ""); 

    LeaseAPI.prototype.web3.eth.getTransactionCount(blockchainConst.ETHEREUM_DEFAULT_ACCOUNT, 
            function (errorTransactionCount, nonce){
        if(errorTransactionCount) return  res.send(badResult);
        
        const txParams = {
            gasPrice: 500000,
            gasLimit: 500000,
            to: blockchainConst.CONTRACT_HOMESHARING_ADDRESS,
            data: method,
            from: blockchainConst.ETHEREUM_DEFAULT_ACCOUNT,
            nonce: '0x' + nonce.toString(16)
        };

        const tx = new Tx(txParams);
        tx.sign(private_key);
        const serializedTx = tx.serialize();

        LeaseAPI.prototype.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, operationHash){
                if(err)  return  res.send(badResult);
                
                var returnResult = {}; 
                returnResult.hash = operationHash;
                LeaseAPI.prototype.db.query(sqlrequests.SQL_UPDATE_CONTRACT_STATUS, 
                    [req.query.contractId, req.query.contractStatus, hash], function(error, result, fields){
                        if(error) return res.send(badResult);
                        
                        returnResult.RESULT = 1;
                        console.log("Contract id: " + req.query.contractId + " House id:" + req.query.houseId +" Operation hash:"  + operationHash);
                        res.send(JSON.stringify(returnResult));
                    });
                
            }); 
        });  
}; 

 
 LeaseAPI.prototype.finishContract = function (req, res){

    var private_key_user =  new Buffer(req.query.userPrivateKey + "", 'hex');  
    var public_key_user = req.query.userPublicKey + "";
 
    LeaseAPI.prototype.web3.eth.getTransactionCount(public_key_user, function (errorTransactionCount, nonce){
        
        if(errorTransactionCount) return res.send(badResult);

        const txParams1 = {
                gasPrice: 1000000,
                gasLimit: 1000000,
                to: req.query.partnerWallet + "",
                from: public_key_user,
                nonce: '0x' + nonce.toString(16), 
                value:   LeaseAPI.prototype.web3.toHex(LeaseAPI.prototype.web3.toWei(req.query.contractPrice, "ether"))
           };
       
           const tx1 = new Tx(txParams1);
           tx1.sign(private_key_user);
           const serializedTx1 = tx1.serialize();

           LeaseAPI.prototype.web3.eth.sendRawTransaction('0x' + serializedTx1.toString('hex'), function(err, hash){
                     if(err){
                           console.log(err.toString());
                           var returnResult = {}; 
                           returnResult.RESULT = 2; 
                           res.send(JSON.stringify(returnResult));     
                       }
                         else{
                                var returnResult = {}; 
                                returnResult.hash = hash;
                                LeaseAPI.prototype.db.query(sqlrequests.SQL_UPDATE_CONTRACT_STATUS, [req.query.contractId, 3, "finished"], function(error, result, fields){
                                    if(error) {
                                        console.log(error + ""); 
                                        res.send(badResult);
                                    }
                                    else{
                                        returnResult.RESULT = 1; 
                                        console.log("Contract id: " + req.query.contractId  +" Operation hash:"  + hash);
                                            res.send(JSON.stringify(returnResult));                                     
                            }
                        });  
                }
            }); 
        
    });      
}; 

LeaseAPI.prototype.cancelTrip =  function(req, res){
    LeaseAPI.prototype.db.query(sqlrequests.SQL_CANCEL_CONTRACT, [req.query.contractId], function(error, result, fields){
        if(error) return res.send(badResult);
        res.send(okResult);
    }); 
};


LeaseAPI.prototype.uploadImg = function(req, res){
    imageLoader(req, res, function (err) {
        if (!err) {
            var path = "http://" + req.hostname + ":" + 3000 + `/images/${req.file.filename}`
            res.status(200).json({ path: path})
        }
    })
}; 
 
module.exports = LeaseAPI;