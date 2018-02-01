function submitQRCode()
{
	var QRCodeId = document.getElementById("entry1").value;
	var productLocation = "Manufacturer";

	$.post("/updateQRdataOnScan",{ QRCodeId : QRCodeId , productLocation : productLocation},function(data){
		if(data == "Error")
		{
			$("#message").text("An error occured.");
		}
		else
		{	
			$("#message").html("QR Code scanned successfully!! || Current Product Trace & Status :|| " + data);
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