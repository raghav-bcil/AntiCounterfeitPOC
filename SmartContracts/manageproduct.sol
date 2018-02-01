pragma solidity ^0.4.12;

contract manageProduct {

//structure to hold data fields
struct product{
    
    bytes32 productId;
    bytes32 productName;
    bytes32 productDescription;
    bytes32 batchNumber;
    bytes32[] qrCodeList;   
  } 
    
event productAddedStatus(

    bytes32 productId,
    bytes32 productName,
    bytes32 productDescription,
    bytes32 batchNumber,
    bool status
  );
    
     
  bytes32[] ProductIdsList; 
  mapping (bytes32 => product) ProductsList;
    

//create new Product 
function createProduct(bytes32 productId,bytes32 productName,bytes32 productDescription, bytes32 batchNumber){
    
    ProductsList[productId].productId =productId;
    ProductsList[productId].productName =productName;
    ProductsList[productId].productDescription =productDescription;
    ProductsList[productId].batchNumber =batchNumber;
    ProductIdsList.push(productId);
    productAddedStatus(productId,productName,productDescription,batchNumber,true);
      
    }
    
//addQRCodesToProduct
function addQRCodesToProduct(bytes32[] qrCodes,bytes32 productId){
    
    uint256 i;
    for(i = 0 ; i < qrCodes.length; ++i){
        ProductsList[productId].qrCodeList.push(qrCodes[i]);            
    }

}

function getproductData(bytes32 productId) returns(
    bytes32 productName,
    bytes32 productDescription,
    bytes32 batchNumber){

    productName = ProductsList[productId].productName;
    productDescription = ProductsList[productId].productDescription;
    batchNumber = ProductsList[productId].batchNumber;
 } 

 function getproductIdsList() returns(bytes32[]){
    return ProductIdsList;
 }
    
}