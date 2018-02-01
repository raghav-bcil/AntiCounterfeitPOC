var express = require("express");  
var bodyParser = require('body-parser')

var app = express(); 
const hex2ascii = require('hex2ascii'); 

var server = require("http").createServer(app);

var moment = require("moment");
var io = require("socket.io")(server);

var now = moment();


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


server.listen(8080, function() {

    console.log('ready to go!');

});


app.use(express.static("public"));

app.get("/", function(req, res){

	res.sendFile(__dirname + "/public/html/index.html");

})

app.get("/index.html", function(req, res){

	res.sendFile(__dirname + "/public/html/index.html");

})

app.get("/product.html", function(req, res){

	res.sendFile(__dirname + "/public/html/product.html");

})

app.get("/createQR.html", function(req, res){

	res.sendFile(__dirname + "/public/html/createQR.html");

})

app.get("/manufacturer.html", function(req, res){

	res.sendFile(__dirname + "/public/html/manufacturer.html");

})

app.get("/logistics.html", function(req, res){

	res.sendFile(__dirname + "/public/html/logistics.html");

})

app.get("/consumer.html", function(req, res){

	res.sendFile(__dirname + "/public/html/consumer.html");

})


var Web3 = require("web3");



web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));	



console.log(web3.isConnected());

//to be read from Database Layer

var productContractObject = web3.eth.contract([ { "constant": false, "inputs": [], "name": "getproductIdsList", "outputs": [ { "name": "", "type": "bytes32[]" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "productId", "type": "bytes32" }, { "name": "productName", "type": "bytes32" }, { "name": "productDescription", "type": "bytes32" }, { "name": "batchNumber", "type": "bytes32" } ], "name": "createProduct", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "qrCodes", "type": "bytes32[]" }, { "name": "productId", "type": "bytes32" } ], "name": "addQRCodesToProduct", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "productId", "type": "bytes32" } ], "name": "getproductData", "outputs": [ { "name": "productName", "type": "bytes32" }, { "name": "productDescription", "type": "bytes32" }, { "name": "batchNumber", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "productId", "type": "bytes32" }, { "indexed": false, "name": "productName", "type": "bytes32" }, { "indexed": false, "name": "productDescription", "type": "bytes32" }, { "indexed": false, "name": "batchNumber", "type": "bytes32" }, { "indexed": false, "name": "status", "type": "bool" } ], "name": "productAddedStatus", "type": "event" } ]);

var productContractInstance = productContractObject.at("0x764d7666f9b14486e0ec90b780fff8ca59821d96");

var QRCodeContractObject = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "newProductTrace", "type": "string" }, { "name": "newStataus", "type": "bytes32" }, { "name": "QRCodeId", "type": "bytes32" } ], "name": "updateProductTraceAndStatus", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "QRCodeId", "type": "bytes32" } ], "name": "getQRCodeData", "outputs": [ { "name": "productId", "type": "bytes32" }, { "name": "productTrace", "type": "string" }, { "name": "productStatus", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "QRCodeId", "type": "bytes32" } ], "name": "getProductStatus", "outputs": [ { "name": "productStatus", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "QRCodeId", "type": "bytes32" } ], "name": "getProductTrace", "outputs": [ { "name": "productTrace", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "QRCodeId", "type": "bytes32" }, { "name": "productId", "type": "bytes32" } ], "name": "createQRCode", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "QRCodeId", "type": "bytes32" }, { "indexed": false, "name": "productId", "type": "bytes32" }, { "indexed": false, "name": "status", "type": "bool" } ], "name": "QRCodeAddedStatus", "type": "event" } ]);

var QRCodeContractInstance = QRCodeContractObject.at("0x99fac13847b1edafaac59c1742c6f8cb171179dd");

app.post("/createProduct", function(req, res){

	console.log(req.body.formData);
	var formDataArray= JSON.parse(req.body.formData);
	console.log(formDataArray);
	for( var i =0 ; i< formDataArray.length; ++i){

		formDataArray[i] = web3.fromAscii(formDataArray[i]);

	}

	productContractInstance.createProduct.sendTransaction(formDataArray[0],formDataArray[1],formDataArray[2],formDataArray[3],{

		from: web3.eth.accounts[0], gas : 4985667,

	}, function(error, transactionHash){

		if (!error)

		{

			res.send(transactionHash);

		}

		else

		{
			console.log(error);

			res.send("Error");

		}

	})

})

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


app.get("/createQRCodes", function(req, res){

		
	console.log(req.query.productId);
	var productId = web3.fromAscii(req.query.productId);
	var quantity = parseInt(req.query.quantity);
	var QRCodes = [];
	for(var i = 0 ; i < quantity ; ++i)
	{
		QRCodes.push(makeid());
	}
	console.log(QRCodes);
	res.send(QRCodes);

})


app.post("/addQRCodesToProduct", function(req, res){

	console.log("Inside addQRCodesToProduct");
	//console.log(req.body.QRCodes);
	//console.log(req.body.productId);
	var QRCodes= JSON.parse(req.body.QRCodes);
	var productId = web3.fromAscii(req.body.productId);
	//console.log(QRCodes);
	var hashesToReturn = [];
	for( var i =0 ; i< QRCodes.length; ++i){

		QRCodes[i] = web3.fromAscii(QRCodes[i]);
		// add a QR code record to the QR code smart contract
		var txnHash = QRCodeContractInstance.createQRCode.sendTransaction(QRCodes[i],productId,
			{from: web3.eth.accounts[0], gas : 4985667});
		hashesToReturn.push(txnHash);
		hashesToReturn.push(" || ");
		console.log(txnHash);
	}

	productContractInstance.addQRCodesToProduct.sendTransaction(QRCodes,productId,{

		from: web3.eth.accounts[0], gas : 4985667,

	}, function(error, transactionHash){

		if (!error)

		{

			console.log(transactionHash);
			hashesToReturn.push(transactionHash);
			res.send(hashesToReturn);


		}

		else

		{
			console.log(error);

			res.send("Error");

		}

	})

})

app.post("/updateQRdataOnScan", function(req, res){

	var QRCodeId = req.body.QRCodeId;
	console.log(QRCodeId);
	QRCodeId = web3.fromAscii(QRCodeId);
	var productLocation = req.body.productLocation;
	console.log(productLocation);
	var productStatus;
	var currentProductTrace = QRCodeContractInstance.getProductTrace.call(QRCodeId);
	console.log(currentProductTrace);
	if(productLocation == "Manufacturer")
	{
		currentProductTrace  = currentProductTrace  + now.format('YYYY-MM-DD HH:mm:ss Z') + "Manufacturer"; 
		productStatus = "Manufactured";
	}
	if(productLocation == "Logistics")
	{
		currentProductTrace  = currentProductTrace  + now.format('YYYY-MM-DD HH:mm:ss Z') + "Logistics"; 
		productStatus = "WithLogistics";
	}
	else if(productLocation == "Consumer")
	{
		currentProductTrace  = currentProductTrace + " || " + now.format('YYYY-MM-DD HH:mm:ss Z') + "Consumer"; 		
		productStatus = "Sold";
	}
	console.log(currentProductTrace);
	console.log(productStatus);
	productStatus = web3.fromAscii(productStatus);

	var hashForProductTraceAndStatus = QRCodeContractInstance.updateProductTraceAndStatus.sendTransaction(currentProductTrace,productStatus,QRCodeId,
		{from: web3.eth.accounts[0], gas : 4985667});
	console.log("tracehash"+hashForProductTraceAndStatus);
	res.send(currentProductTrace+" || "+hex2ascii(productStatus)+ " || " + hashForProductTraceAndStatus);
	
})

app.get("/checkAuthenticity", function(req, res){

	console.log(req.query.QRCodeId);
	QRCodeId = web3.fromAscii(req.query.QRCodeId);
	var data = QRCodeContractInstance.getQRCodeData.call(QRCodeId);
	var status = hex2ascii(data[2]);
	console.log("status = " + status);
	var authenticityStatus;
	if(status=="Sold")
	{
		authenticityStatus = "Fake Product";
	}
	else {
		authenticityStatus = "Authentic Product";
	} 
	res.send(authenticityStatus);

})


app.get("/getQRCodeData", function(req, res){

	console.log(req.query.QRCodeId);
	QRCodeId = web3.fromAscii(req.query.QRCodeId);
	var data = QRCodeContractInstance.getQRCodeData.call(QRCodeId);
	var productDetails = productContractInstance.getproductData.call(data[0]);
	for(i=0;i<3;++i){
		productDetails[i] = hex2ascii(productDetails[i]);
	}
	res.send(productDetails);

})



