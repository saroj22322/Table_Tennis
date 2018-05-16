window.onload= function() {
	var canvas = document.getElementById("canvas");
	var cxt = canvas.getContext("2d");	
	var leerPlatz = 100;
	var leerPlatzMarginX = 150;
	var leerPlatzFillColor = "yellow";
	var framesProSekunde = 30;
	var radius = 8;

	var geschBallX = 10;
	var geschBallY = 5;
	var posY;
	var posX;
	var spieler1Punkt;
	var spieler2Punkt;	

	function defaultWert() {
		geschBallX = 10;
		geschBallY = 5;
		posY = radius+leerPlatz;
		posX= radius+leerPlatz;
		spieler1Punkt = 0;
		spieler2Punkt = 0;
	}

	var zeug1PosY = 200;
	var zeug2PosY = 200;
	const ZEUG_HOHE = 100;
	const ZEUG_BREITE = 10;

	var TOP1 = false, DOWN1 = false;
	var TOP2 = false, DOWN2 = false;
	const GESCHSPIEL = 15;
	var geschBallRate= 0.13;
	const BALLFARBE = "red";
	const PAD1FARBE = "green";
	const PAD2FARBE = "black";
	const SIEGPUNKT = 10;

	var spielWieder;
	var pausedState = false;

	var zuruck = new Audio();
	zuruck.src = "zuruck.mp3";
	zuruck.volume = 0.5;
	var fail = new Audio();
	fail.src = "fail.mp3";
	fail.volume = 0.2;

	var platz = document.getElementById("platz");

	document.getElementById("weiter").addEventListener("click",spielWeiter);
	document.getElementById("neustart").addEventListener("click",restartSpiel);
	document.getElementById("hauptmenu").addEventListener("click", function() {
		pausedState = false;
		alleVersteck();
		startSeite();
	});
	document.getElementById("neustart1").addEventListener("click",function() {
		versteckEin("ende");
		restartSpiel();
	});
	document.getElementById("hauptmenu1").addEventListener("click", function() {
		pausedState = false;
		alleVersteck();
		startSeite();
	});
	document.getElementById("hilfe1").addEventListener("click",zeigHilfe);
	document.getElementById("zuruck").addEventListener("click",zuruckVonHilfe);
	document.getElementById("musik").addEventListener("click",function(evt) {
		if(fail.muted) {
			fail.muted = false;
			zuruck.muted = false;
			evt.target.style.background = "url(\"img/buttons.png\") 160px 65px";
		} else {
			fail.muted = true;
			zuruck.muted = true;
			evt.target.style.background = "url(\"img/buttons.png\") 100px 65px";
		}
	});
	document.getElementById("hilfebtn").addEventListener("click",function() {
		zeigHilfe(1);
	});



	function zeigHilfe(id = 0){
		// Überprufen ob es von Spiel abgeleitet ist.		
		if(id == 1) {
			pausedState = true;
			clearInterval(spielWieder);
		} 
		zeigEin("hilfe");
	}

	function zuruckVonHilfe() {
		if(pausedState) {
			pausedState = false;
			bewegung();
		}
		versteckEin("hilfe");
	}


	startSeite();

	function restartSpiel() {
		defaultWert();
		spielWeiter();
	}

	function startSeite() {
		document.getElementById("startbild").style.display = "block";
		var btn = document.getElementById("losSpiel");
		btn.addEventListener("click",losSpiel);
	}

	function losSpiel() {
		alleVersteck();
		defaultWert();
		cxt.fillStyle = leerPlatzFillColor;
		cxt.fillRect(leerPlatzMarginX,0,(canvas.width-(2*leerPlatzMarginX)),leerPlatz);
		var kontrol = document.getElementById("kontrol");
		kontrol.style.display = "block";
		canvas.style.display = "block";
		bewegung();
	}

	function bewegung() {
		spielWieder= setInterval(function(){
		erzeugAlle();
		bewegBall();
		spielerBeweg();
		}, 1000/framesProSekunde);
	}

	function alleVersteck() {
		var x = document.getElementsByClassName("spiel");
		for (var i = x.length - 1; i >= 0; i--) {
			x[i].style.display = "none";
		}
	}

	function versteckEin(id) {
		var x = document.getElementById(id);
		x.style.display = "none";
	}

	function zeigEin(id) {
		var x = document.getElementById(id);
		x.style.display = "block";
	}

	function pauseStateFunktion() {
		pausedState = true;
		clearInterval(spielWieder);
		zeigEin("pause");
	}

	document.onkeydown = function(e) {
		if(canvas.style.display == "block"){
			if(e.keyCode == 38) TOP2 = true;
			if(e.keyCode == 87) TOP1 = true;
			if(e.keyCode == 40) DOWN2 = true;
			if(e.keyCode == 83) DOWN1 = true;
			if(e.keyCode == 80){
				if(pausedState) {
					spielWeiter();
				}
				else
				{
					pauseStateFunktion();
				}
			}
			if(e.keyCode == 72) zeigHilfe(1);
		}
	}


	document.onkeyup = function(e) {
		if(e.keyCode == 38) TOP2 = false;
		if(e.keyCode == 87) TOP1 = false;
		if(e.keyCode == 40) DOWN2 = false;
		if(e.keyCode == 83) DOWN1 = false;
	}	

	function spielWeiter() {
		pausedState = false;
		versteckEin("pause");
		bewegung();
	}

	function spielerBeweg() {
		if(TOP1) {
			if(zeug1PosY>(leerPlatz-(ZEUG_HOHE/2)))
				zeug1PosY -= GESCHSPIEL; 
		}
		if(DOWN1) {
			if(zeug1PosY<(canvas.height - ZEUG_HOHE/2))
				zeug1PosY += GESCHSPIEL; 
		}
		if(TOP2) {
			if(zeug2PosY>(leerPlatz-(ZEUG_HOHE/2)))
				zeug2PosY -= GESCHSPIEL; 
		}
		if(DOWN2) {
			if(zeug2PosY<(canvas.height - ZEUG_HOHE/2))
				zeug2PosY += GESCHSPIEL; 
		}
	}	

	function bewegBall() {		
		//autoBeweg();
		geschBallRate = (Math.floor(Math.random() * (20 - 12 + 1)) + 10)/100;

		posX += geschBallX;
		if(posX<radius) {
			if((posY+radius)>zeug1PosY && (posY-radius)<zeug1PosY+ZEUG_HOHE) {
				zuruck.play();
				geschBallX *= -1;
				var diffY = posY - (zeug1PosY + ZEUG_HOHE/2);
				geschBallY += diffY * geschBallRate;
			}else {
				fail.play();
				spieler2Punkt++;
				ballReset();
			}
		}

		if(posX>canvas.width-radius) {
			if((posY+radius)>zeug2PosY && (posY-radius)<zeug2PosY+ZEUG_HOHE) {
				zuruck.play();
				geschBallX *= -1;
				var diffY = posY - (zeug2PosY + ZEUG_HOHE/2);
				geschBallY += diffY * geschBallRate;
			}else {
				fail.play();
				spieler1Punkt++;
				ballReset();
			}
		}

		posY += geschBallY;
		geschBallY = posY<(radius+leerPlatz) ? -geschBallY : posY>(canvas.height-radius) ? -geschBallY : geschBallY;
	}

	function erzeugAlle() {
		erzeugRecht(0,0,leerPlatzMarginX,leerPlatz,leerPlatzFillColor);
		erzeugRecht(canvas.width-leerPlatzMarginX,0,leerPlatzMarginX,leerPlatz,leerPlatzFillColor);
		erzeugRecht(0,leerPlatz-30,canvas.width-leerPlatzMarginX,30,leerPlatzFillColor);
		//erzeugRecht(0,leerPlatz,canvas.width,canvas.height,'black');
		//erzeugNet();
		cxt.drawImage(platz,0,leerPlatz,canvas.width,(canvas.height - leerPlatz));

		erzeugBall(posX,posY,radius,BALLFARBE);

		erzeugRecht(0,zeug1PosY,ZEUG_BREITE,ZEUG_HOHE,PAD1FARBE);
		erzeugRecht(canvas.width-ZEUG_BREITE,zeug2PosY,ZEUG_BREITE,ZEUG_HOHE,PAD2FARBE);

		cxt.font = "20px \"Comic Sans MS\"";
		cxt.fillText("Score :"+spieler1Punkt,leerPlatzMarginX/4,leerPlatz/2);
		cxt.fillText("Score :"+spieler2Punkt,canvas.width-(leerPlatzMarginX),leerPlatz/2);
	}

	function erzeugNet() {
		for (var i = leerPlatz; i <= canvas.height; i+=40) {
			cxt.fillStyle = 'white';
			cxt.fillRect((canvas.width/2)-1,i,1,20);
		}
		return;
	}
			
	function ballReset() {
		var check = checkWinner();
		if(!check) {
			geschBallX *= -1;
			posX = canvas.width/2;
			posY = canvas.height/2;
			geschBallY = 1;
			return;
		}
		var sieger = spieler2Punkt>spieler1Punkt ? "Player 2" : "Player 1";
		var farbeSieger = spieler2Punkt>spieler1Punkt ? PAD2FARBE : PAD1FARBE;
		document.getElementById("siegername").innerHTML = sieger;
		document.getElementById("siegername").style.color = farbeSieger;
		pausedState = true;
		clearInterval(spielWieder);
		zeigEin("ende");
	}

	function checkWinner() {
		if(spieler1Punkt >= SIEGPUNKT || spieler2Punkt >= SIEGPUNKT)
			return true;
		else
			return false;
	}

	function erzeugRecht(x,y,hohe,breite,farbe) {
		cxt.fillStyle = farbe;
		cxt.fillRect(x,y,hohe,breite);
	}

	function erzeugBall(x,y,radi,farbe) {
		cxt.beginPath();
		cxt.fillStyle = farbe;
		cxt.arc(x,y,radi,0,2*Math.PI,true);
		cxt.fill();
	}

}




/*canvas.addEventListener('mousemove', function(evt) {
		var mausLoc = mausPos(evt);
		zeug1PosY = mausLoc.y - ZEUG_HOHE/2;
		//zeug2PosY = mausLoc.y - ZEUG_HOHE/2;
	});*/


	/*function mausPos(evt) {
		var rect = canvas.getBoundingClientRect();
		var doc = document.documentElement;
		var mausX = evt.clientX - rect.left - doc.scrollLeft;
		var mausY = evt.clientY - rect.top - doc.scrollTop;

		return {
			x : mausX, y : mausY
		}
	}*/


/*function autoBeweg() {
		//zeug2PosY = posY-ZEUG_HOHE/2;
		var zeug2PosYCenter = zeug2PosY+(ZEUG_HOHE/2);
		if(zeug2PosYCenter < (posY-(ZEUG_HOHE/4)))
		{
				zeug2PosY += (geschBallY*2);
		}
		else if(zeug2PosYCenter > (posY+(ZEUG_HOHE/4)))
		{
			zeug2PosY -= (geschBallY*2);
		}
	}*/






/*window.addEventListener('keydown', function(evt){
		switch(evt.keyCode) {
			case 40:
				if(zeug2PosY<(canvas.height - ZEUG_HOHE-1))
				zeug2PosY += ZEUG_HOHE/3;
				break;
			case 38:
				if(zeug2PosY>0)
				zeug2PosY -= ZEUG_HOHE/3;
				break;
			case 83:
				if(zeug1PosY<(canvas.height - ZEUG_HOHE-1))
				zeug1PosY += ZEUG_HOHE/3;
				break;
			case 87:
				if(zeug1PosY>0)
				zeug1PosY -= ZEUG_HOHE/3;
				break;
		}

	});*/