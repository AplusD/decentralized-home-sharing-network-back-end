pragma solidity ^0.4.23;
    
contract HomeSharingContract {

    // Structure of transaction 
    struct Transaction 
    {
        string transacationHash; 
        uint transacationId; 
        address client; 
        uint houseId; 
        string price; 
        string from; 
        string to; 
    }

    mapping (uint => Transaction []) transacations; 
    
    event transacationInserted(uint transacationID, uint houseId); 
    
    address contractOwner; 
  
    modifier isOwner()
    {
        require(contractOwner == msg.sender);
        _; 
    }    
    

    function addTransacation (string transactionHash, uint   transacationID, address client, uint houseId, string from, string to, string housePrice) payable  {
        transacations[houseId].push(Transaction (transactionHash, transacationID, client, houseId,  housePrice, from, to)); 
        emit transacationInserted(transacationID, houseId); 
    }
    
    function getTransacation (uint houseId, uint transacationId) public isOwner view returns (address client, string from, string to, string price)  {
        Transaction[] currTrans = transacations[houseId];    
 
        for(uint i = 0; i < currTrans.length; i++){
        if(currTrans [i].transacationId == transacationId)
            return(currTrans[i].client,  currTrans[i].from, currTrans[i].to,  currTrans[i].price);
       }
    }
    
    function getTransacationHash(uint houseId, uint transacationId) public isOwner view returns (string hash){
         Transaction[] currTrans = transacations[houseId];    
 
        for(uint i = 0; i < currTrans.length; i++){
        if(currTrans [i].transacationId == transacationId)
            return(currTrans[i].transacationHash);
       }
    }

}
