function createQRCodes()
{
	var productId = document.getElementById("entry1").value;
	var quantity = document.getElementById("entry2").value;

	$.get("/createQRCodes?productId=" + productId + "&quantity=" + quantity , function(data){
		if(data == "")
		{
			$("#message").text("No Record found for this product Id");
		}
		else
		{
			$("#message").html("QR Codes Successfuly Generated: " + data);
			
			//Array of QR codes generated by previous API call
			data= JSON.stringify(data);
			
			$.post("/addQRCodesToProduct",{ QRCodes : data , productId : productId},function(data2){
				if(data == "Error")
				{
					$("#message").text("An error occured.");
				}
				else
				{	
					$("#message").append("  Transaction hashes: " + data2);
				}
			});
		}
	});

}

var socket = io("http://52.226.73.240:8080");

socket.on("connect", function () {
	socket.on("message", function (msg) {
		if($("#events_list").text() == "No Transaction Found")
		{
			$("#events_list").html("<li>Txn Hash: " + msg.transactionHash + "\nRecord Id: " + msg.args.entry1 + "</li>");
		}
		else 
		{
			$("#events_list").prepend("<li>Txn Hash: " + msg.transactionHash + "\nRecord Id: " + msg.args.entry1 + "</li>");
		}
    });
});