function createColorImage(SIZE , R,G,B){

	
	
	var newCanvas = document.createElement("canvas");
	newCanvas.width		= SIZE;
	newCanvas.height 	= SIZE;
	var newCTX = newCanvas.getContext('2d');
	var imageData = newCTX.getImageData(0,0,SIZE,SIZE);
	
	

	for(var x=0;x<SIZE;x++)
		for(var y=0;y<SIZE;y++)
		{	
			var index = 4 * (x* SIZE + y );
			imageData.data[index+0]=R-parseInt(Math.random()*30);
			imageData.data[index+1]=G-parseInt(Math.random()*30);
			imageData.data[index+2]=B;
			imageData.data[index+3]=255;	
		}
	
	
	newCTX.putImageData(imageData, 0, 0);
	

	return  newCanvas.toDataURL("image/png");

}


function createWinImage( ){

	var R = 230,G = 230, B= 230;
	var SIZE = 400;
	
	var newCanvas = document.createElement("canvas");
	newCanvas.width		= 400;
	newCanvas.height 	= 400;
	var newCTX = newCanvas.getContext('2d');
	var imageData = newCTX.getImageData(0,0,SIZE,SIZE);
	
	

	for(var x=0;x<SIZE;x++)
		for(var y=0;y<SIZE;y++)
		{	
			var index = 4 * (x* SIZE + y );
			imageData.data[index+0]=R;
			imageData.data[index+1]=G;
			imageData.data[index+2]=B;
			imageData.data[index+3]=255;	
		}
	
	
	newCTX.putImageData(imageData, 0, 0);
	newCTX.font="20px Georgia";
	newCTX.fillText("You won the battle!",50,50);	

	return  newCanvas.toDataURL("image/png");

}


function createLoseImage( ){

	var R = 230,G = 230, B= 230;
	var SIZE = 400;
	
	var newCanvas = document.createElement("canvas");
	newCanvas.width		= 400;
	newCanvas.height 	= 400;
	var newCTX = newCanvas.getContext('2d');
	var imageData = newCTX.getImageData(0,0,SIZE,SIZE);
	
	

	for(var x=0;x<SIZE;x++)
		for(var y=0;y<SIZE;y++)
		{	
			var index = 4 * (x* SIZE + y );
			imageData.data[index+0]=R;
			imageData.data[index+1]=G;
			imageData.data[index+2]=B;
			imageData.data[index+3]=255;	
		}
	
	
	newCTX.putImageData(imageData, 0, 0);
	newCTX.font="20px Georgia";
	newCTX.fillText("You lose!",50,50);	

	return  newCanvas.toDataURL("image/png");

}