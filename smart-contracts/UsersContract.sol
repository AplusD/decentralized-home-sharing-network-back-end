pragma solidity ^0.4.23;

contract UsersContract {
 
    struct User
    {
        uint256 userId; 
        address userAddress; 
    }

   
    address contractOwner; 
    
    mapping(address => User) users; 
     
    modifier isOwner()
    {
        require(contractOwner == msg.sender);
        _; 
    }

    function UsersContract()
    {
        contractOwner = msg.sender; 
    }
    
    function addUser(uint256 userId, address userAddress)
    {
        users[userAddress] = User(userId, userAddress); 
    }
    
   function getUser(address userAddress) public constant returns  (uint, address)
   {
       return (users[userAddress].userId, users[userAddress].userAddress); 
   }
   
    
}