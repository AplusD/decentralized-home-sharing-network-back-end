
// const badResult = "{ \"RESULT\": 0 }";
// const okResult = "{ \"RESULT\": 1 }";

// exports.writeToBlockchain = function(privateKey, method ){

//     const private_key = new Buffer(privateKey, 'hex');
//     const method =  
  
//     web3.eth.getTransactionCount(constants.ETHEREUM_DEFAULT_ACCOUNT, function (errorTransactionCount, nonce){
//         const txParams = {
//             gasPrice: 500000,
//             gasLimit: 500000,
//             to: constants.CONTRACT_RENT_ADDRESS,
//             data: method,
//             from: constants.ETHEREUM_DEFAULT_ACCOUNT,
//             nonce: '0x' + nonce.toString(16)
//         };

//         const tx = new Tx(txParams);
//         tx.sign(private_key);
//         const serializedTx = tx.serialize();
//         web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, operationHash){
//                 if(err){
//                     console.log(err + ""); 
//                     res.send(constants.JSON_RESULT_CANCELED);
//                 }
//                 else{

//                 }
//             }); 
//         });  
// }; 


// exports.transferFunds = function(res, req, web3, private_keyf, public_keyf, public_keyt, funds){
    
//     web3.eth.getTransactionCount(public_keyf, function (errorTransactionCount, nonce){

//         if(errorTransactionCount){
//             console.log(errorTransactionCount + "");
//             res.send(badResult);
//         }
        
//         const txParams1 = {
//                 gasPrice: 1000000,
//                 gasLimit: 1000000,
//                 to: public_keyt,
//                 from: public_keyf,
//                 nonce: '0x' + nonce.toString(16), 
//                 value:   web3.toHex(web3.toWei(funds, "ether"))
//            };
       
//         const tx1 = new Tx(txParams1);
//         tx1.sign(private_keyf);
//         const serializedTx1 = tx1.serialize();

//         web3.eth.sendRawTransaction('0x' + serializedTx1.toString('hex'), function(err, hash){
//                 if(err){
//                         var returnResult = {}; 
//                         returnResult.RESULT = 2; 
//                         return res.send(JSON.stringify(returnResult));     
//                     }
                       
//                 var returnResult = {}; 
//                 returnResult.hash = hash;

//                                 db.query(sqlrequests.SQL_UPDATE_CONTRACT_STATUS, [req.query.contractId, 3, "finished"], function(error, result, fields){
//                                     if(error) {
//                                         console.log(error + ""); 
//                                         res.send(constants.JSON_RESULT_CANCELED);
//                                     }
//                                     else{
//                                         returnResult.RESULT = 1; 
//                                         console.log("Contract id: " + req.query.contractId  +" Operation hash:"  + hash);
//                                             res.send(JSON.stringify(returnResult));                                     
//                                         }
//                         });  
//                     }
//             }); 
        
//     });      
// };