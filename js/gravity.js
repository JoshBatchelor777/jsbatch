int totalObjects = 250;
int bag = totalObjects;
int width = 600;
int height = 600;
float velocity = 2;

float[] xcoord = new float[totalObjects];
float[] ycoord = new float[totalObjects];
float[] xvel = new float[totalObjects];
float[] yvel = new float[totalObjects];
float[] xacc = new float[totalObjects];
float[] yacc = new float[totalObjects];
float[] mass = new float[totalObjects];
float diffx;
float diffy;
float dist;
float G = 1;
float force;
float xforce;
float yforce;
int inside;
int index;
srting label = "";


// black hole listener.
int c = 0;

void setup() {
	size(600,600);
	var thing = document.getElementsByClassName(grav);
	// create all my objects
	for(c = 0; c < totalObjects; c++) 
	{
		xcoord[c] = random(width);
		ycoord[c] = random(height);
		xvel[c] = random(-velocity, velocity);
		yvel[c] = random(-velocity, velocity);
		mass[c] = random(.25, 7.5);
		blackHole();
	}
}

void draw() {
	// Calculate the forces
	calculateForce();
	// update object coordinates
	updatePosition();
	// check for collisions
	collision();
	// zoom check
	zoomCheck();
	// draw objects
	drawObjects();
	// trying out a thing
}

void bang() 
{
	if (bag <= 123)
	{
		//totalObjects = totalObjects + 10;
		print("OBJECTS RUNNING LOW!");
	}

	return label;

}
void blackHole() 
{
	if (c >= totalObjects - 1)
	{
		mass[c] = 200;
		xvel[c] = 0.075;
		yvel[c] = 0.075;
		xcoord[c] = width / 2;
		ycoord[c] = height / 2;
	}
	if (mass[c] >= 201)
	{
		println("SUCCESS!" + mass[c]);
	}
}

void calculateForce() 
{
	for(int a = 0; a < totalObjects; a++) 
	{
		xacc[a] = 0;
		yacc[a] = 0;
		// consider the force on a based on object b.
		for (int b = 0; b < totalObjects; b++)
		{
			if (a != b && mass[a] != 0) 
			{
				// if a'm not the same object, and I don't have a mass of 0,
				// consider what the amount of force is going to be.
				// Calculate the distance between trwo different masses; Using the
				// Pythagorean Theorem. Distance = Hypotenuse. Distance = x(2) * y(2)
				// Gravity * mass1 * mass2 / radius(2) = Force.
				diffx = xcoord[b] - xcoord[a];
				diffy = ycoord[b] - ycoord[a];
				dist = sqrt(sq(diffx) + sq(diffy));
				force = (G * mass[a] * mass[b]) / sq(dist);
				xforce = force * diffx / dist;
				yforce = force * diffy / dist;
				xacc[a] = xacc[a] + (xforce / mass[a]);
				yacc[a] = yacc[a] + (yforce / mass[a]);
			}
		}
		xvel[a] = xvel[a] + xacc[a];
		yvel[a] = yvel[a] + yacc[a];
	}
}


void drawObjects() 
{
	fill(255);
	background(0);
	for(int a = 0; a < totalObjects; a++)
	{
		if (mass[a] != 0){
			ellipse(xcoord[a], ycoord[a], 2 * sqrt(mass[a]), 2 * sqrt(mass[a]));
		}
	}
}


void updatePosition()
{
	for (int a = 0; a < totalObjects; a++)
	{
		xcoord[a] = xcoord[a] + xvel[a];
		ycoord[a] = ycoord[a] + yvel[a];
	}
}


// Inelastic collision: m1*v1+m2v2=(m1+m2)*v3
/*
	If the distance of the center of a, and center of b, is
	less than the two radiuses added together, they are colliding.
*/

void collision()
{
	for (int a = 0; a < totalObjects; a++) {
		for (int b = 0; b < totalObjects; b++) {
			if (a != b && mass[a] != 0 && mass[b] != 0) {
				// calculate if the distance between the two objects is < 0
				diffx = xcoord[b] - xcoord[a];
				diffy = ycoord[b] - ycoord[a];
				dist = sqrt(sq(diffx) + sq(diffy));
				// if the distance is less than or equal to the square root of masses a & b sqaured...
				if (dist <= sqrt(mass[a]) + sqrt(mass[b])) {
					xvel[a] = ((mass[a] * xvel[a]) + (mass[b] * xvel[b])) / (mass[a] + mass[b]);
					yvel[a] = ((mass[a] * yvel[a]) + (mass[b] * yvel[b])) / (mass[a] + mass[b]);
					mass[a] = mass[a] + mass[b];
					xcoord[a] = ((mass[a] * xcoord[a]) + (mass[b] * xcoord[b])) / (mass[a] + mass[b]);
					ycoord[a] = ((mass[a] * ycoord[a]) + (mass[b] * ycoord[b])) / (mass[a] + mass[b]);
					// Remove the mass of b, it will no longer be considered in any of these other equations.
					mass[b] = 0;
					bag--;
				}
			}
		}
	}
}


void zoomCheck() 
{
	// check for re-centering.
	inside = -1;
	index = 0;
	// Find the largest mass.

	for (int a = 0; a < totalObjects; a++)
	{
		if (mass[a] >= mass[index]) 
		{
			index = a;
		}
	}
	// Check if it is in the screen.
	// if x is between 0 and the width of the screen and y is bewteen 0 and the heighth of the screen,
	// You are in the screen!
	if (xcoord[index] >= 0 && xcoord[index] <= width && ycoord[index] >=0 && ycoord[index] <= height)
	{
		inside = 1;
	}
	if (inside == -1)
	{
		// re-center largest mass
		// figure out the diffence between my x coordinate and the center of the screen
		diffx = (width / 2) - xcoord[index];
		// same for y.
		diffy = (height / 2) - ycoord[index];
		for (int a = 0; a < totalObjects; a++)
		{
			xcoord[a] = xcoord[a] + diffx;
			ycoord[a] = ycoord[a] + diffy;
		}
		// zoom
		for (int a = 0; a < totalObjects; a++) {
			if (a != index) {
				diffx = xcoord[index] - xcoord[a];
				diffy = ycoord[index] - ycoord[a];

				xcoord[a] = xcoord[a] + (diffx / 2);
				ycoord[a] = ycoord[a] + (diffy / 2);

				xvel[a] = (xvel[a] / 2);
				yvel[a] = (yvel[a] / 2);

				mass[a] = mass[a] / 2;	
			}
		}
	}
}