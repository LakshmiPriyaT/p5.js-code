
let arrows = [];
let launchers = [];
let gravity = 0.5;
let barriers = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

	launchers.push(new Launcher(200, height/2));
	barriers.push(new Barrier(width*0.75-50, height/2 - 100, width*0.75-40, height/2 - 120));
}

function mousePressed() {
	launchers[0].pressPos = createVector(mouseX, mouseY);
}

function mouseDragged() {
	launchers[0].setBowValues();
}

function mouseReleased() {
	launchers[0].shoot(mouseX, mouseY);
}

function draw() {
	background(0);

	barriers[0].a = createVector(mouseX, mouseY);
	barriers[0].b = createVector(mouseX - 10, mouseY - 20);

	if(keyIsPressed){
		if(keyCode === LEFT_ARROW)
			launchers[0].angleOff -= map(launchers[0].drawBackMag, 0, launchers[0].maxForce, 0.001, 0.00001);
		else if(keyCode === RIGHT_ARROW)
			launchers[0].angleOff += map(launchers[0].drawBackMag, 0, launchers[0].maxForce, 0.001, 0.00001);;
	}

	if(mouseIsPressed) {
		launchers[0].bowTarget = map(launchers[0].drawBackMag, 0, 25, 10, 35);
	} else {
		launchers[0].bowTarget = 10;
	}

	launchers[0].dragPos = createVector(mouseX, mouseY);

	for(let arrow of arrows) {
		arrow.update();
		arrow.show();
	}

	for(let launcher of launchers) {
		//launcher.update();
		launcher.updateBow();
		launcher.show();

		launcher.showOptimal(barriers[0]);
	}

	for(let b of barriers){
		b.checkIntersection();
		b.show();
	}	
	
	for(let i = arrows.length - 1; i >= 0; i--){
		if(arrows[i].pos.y > height + 250)
			arrows.splice(i, 1);
	}
}