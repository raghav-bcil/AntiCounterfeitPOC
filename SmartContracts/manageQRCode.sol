pragma solidity ^0.4.12;

contract manageQRCode {

//structure to hold QR code data
struct QRCode{
    
    bytes32 QRCodeId;
    bytes32 productId;
    string productTrace;
    bytes32 productStatus;   
  } 
    
event QRCodeAddedStatus(

    bytes32 QRCodeId,
    bytes32 productId,
    bool status
    
  );
      
  bytes32[] QRCodeIdsList; 
  mapping (bytes32 => QRCode) QRCodesList;
    

//add new QR code 
function createQRCode(bytes32 QRCodeId,bytes32 productId){
    
    //record for that QR code already existing
    if(QRCodesList[QRCodeId].productId != ""){

        QRCodeAddedStatus(QRCodeId, productId,false);    
    }

    //it is the new QR code to be added
    QRCodesList[QRCodeId].QRCodeId = QRCodeId;
    QRCodesList[QRCodeId].productId = productId;
    QRCodeIdsList.push(QRCodeId);
    QRCodeAddedStatus(QRCodeId, productId,true);
      
}

//update Product Trace by Company's Inventories
function updateProductTrace(string newProductTrace, bytes32 QRCodeId){

    QRCodesList[QRCodeId].productTrace = newProductTrace; 
}

//update Product Status each time QR code is scanned including one by the Consumer
function updateProductStatus(bytes32 newStataus, bytes32 QRCodeId){

    QRCodesList[QRCodeId].productStatus = newStataus;   
}

function getProductTrace(bytes32 QRCodeId) returns(string productTrace){

    productTrace = QRCodesList[QRCodeId].productTrace; 
}


function getProductStatus(bytes32 QRCodeId) returns(bytes32 productStatus){

    productStatus = QRCodesList[QRCodeId].productStatus;     
}
    
//get QR Code Data for final Consumer
function getQRCodeData(bytes32 QRCodeId) returns(
    bytes32 productId,
    string productTrace,
    bytes32 productStatus){

    productId = QRCodesList[QRCodeId].productId;
    productTrace = QRCodesList[QRCodeId].productTrace;
    productStatus = QRCodesList[QRCodeId].productStatus;
 } 
    

}