// REST API ARCHITCTURE 
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

const router = express.Router(); 

var fs = require('fs');
const fileType = require('file-type'); 

 
// ETHEREUM 
var solc = require('solc');
var fs = require('fs');
const Web3 = require('web3');
 
//MYSQL 
var mysql = require('mysql');
var db;

//CONSTANTS 
var pathConstants = require('./lib/path_constants');
var helpfunction = require('./lib/helpfunction');

var contractRent; 
var contractUsers;
var web3;

var LeaseAPI = require('./modules/lease_lodgings'); 
var leaseAPI = new LeaseAPI();  

var AccountAPI = require('./modules/accounts');
var accountAPI = new AccountAPI();

var RentAPI = require('./modules/rent_lodgings'); 
var rentApi = new RentAPI(); 
 

//LOGGER 
app.use(function(req, res, next){
    console.log(helpfunction.getDateTime() + " - " + req.url + " ||| IP:" + req.ip); 
    next();
});



app.get(pathConstants.MAIN_ADDRESS, function (req, res) {
    res.send("Decentralized application for rent/lease lodging based on Blockchain");
});

app.get(pathConstants.GET_LODINGS, leaseAPI.getLodgings);

app.get(pathConstants.CHECK_LODGINGS_DATE, leaseAPI.checkHouse);

app.get(pathConstants.GET_LODGINGS_LOCATION, leaseAPI.getLodgingsLocations); 

app.get(pathConstants.GET_HOUSE_INFO, leaseAPI.getLodgingInfo); 

app.get(pathConstants.GET_CHAT, leaseAPI.getChat); 

app.get(pathConstants.SEND_MSG, leaseAPI.sendMsg); 

app.get(pathConstants.START_CONTRACT,  leaseAPI.startContract); 

app.get(pathConstants.UPDATE_CONTRACT_STATUS, leaseAPI.updateContractStatus);

app.get(pathConstants.FINISH_CONTRACT, leaseAPI.finishContract);

app.get(pathConstants.CANCEL_TRIP, leaseAPI.cancelTrip);

app.post(pathConstants.UPLOAD_IMG, leaseAPI.uploadImg);


app.get(pathConstants.AUTH, accountAPI.auth);

app.get(pathConstants.LOGIN, accountAPI.login); 
 
app.get(pathConstants.GET_USER_INFO, accountAPI.getUserInfo);

app.get(pathConstants.GET_YOUR_OFFERINGS, accountAPI.getUserOfferings); 

app.get(pathConstants.GET_YOUR_TRIPS,  accountAPI.getUserTrips); 
 
app.get(pathConstants.CREATE_ACCOUNT, accountAPI.createAccount); 
 

app.get(pathConstants.ADD_LODGINGS, rentApi.addLodging);

app.get(pathConstants.ADD_LODGING_IMG, rentApi.addLodging); 

app.get(pathConstants.UPDATE_MAIN_HOUSE_IMG, rentApi.updateMainLodgingImg); 

app.get(pathConstants.PUBLISH_LODGING, rentApi.publishLodging); 

app.get(pathConstants.GET_HOUSE_TYPES, rentApi.getLodgingsTypes);


app.use(function (err, req, res, next) {
    if (err.code == 'ENOENT') 
        res.status(404).json({message: 'Image Not Found !'})
    else 
        res.status(500).json({message:err.message}) 
});

router.get('/images/:imagename', function(req, res) {
    var imagename = req.params.imagename
    
    var imagepath = __dirname + "/images/" + imagename
    var image = fs.readFileSync(imagepath)
    var mime = fileType(image).mime

	res.writeHead(200, {'Content-Type': mime })
	res.end(image, 'binary')
});

app.use('/', router);
 
//CRASH CALLBACK 
app.use(function(err, req, res, next){
    if(err) return console.log(helpfunction.getDateTime() + ":" +  req.url + "\n" + err.toString());
    next();
});


function handleDatabaseConnection()
{
    db = mysql.createConnection({
            host:'sql7.freemysqlhosting.net',
            user:'sql7277368',
            password:'tXUs4bYZtc',
            database : 'sql7277368',
            connectTimeout: 60000, 
            supportBigNumbers : true 
        });

    // db = mysql.createConnection({
    //             host:'homesharing.cmhwdist1pdi.us-east-1.rds.amazonaws.com',
    //             user:'root',
    //             password:'9ndssvDmwc',
    //             database : 'homesharing',
    //             connectTimeout: 60000, 
    //             supportBigNumbers : true , 
    //             port: 3306
    //         });

    db.connect(function (error) {
        if(error) 
        {
            console.log(error);
            setTimeout(handleDatabaseConnection, 2000);     
        }
        else{
         console.log(helpfunction.getDateTime() +  " - Database connection established");
         leaseAPI.setDb(db);
         accountAPI.setDb(db);
         rentApi.setDb(db);
        }
    });

    db.on('error', function(error){
        if(error.code === 'PROTOCOL_CONNECTION_LOST') {                     
            handleDatabaseConnection();
          } else {                                       
            throw error;                                 
          }
    });
}

function handleEthereumConnection()
{
    var blockChainConst = require("./lib/blockchain_constants"); 

    web3 = new Web3(new Web3.providers.HttpProvider(blockChainConst.ROPSTEN_LINK));

    var contractSolidityRent = fs.readFileSync('./smart-contracts/HomeSharingContract.sol', 'utf-8');
    var outputRent = solc.compile(contractSolidityRent, 1);
    const bytecode1 = outputRent.contracts[':HomeSharingContract'].bytecode;
    const abiRent = JSON.parse(outputRent.contracts[':HomeSharingContract'].interface);
    var contractRent = web3.eth.contract(abiRent).at(blockChainConst.CONTRACT_HOMESHARING_ADDRESS);

    leaseAPI.setWeb3(web3, contractRent);
}




var server = app.listen(app.get('port'), function () {
    handleDatabaseConnection();
    handleEthereumConnection();   
});

 