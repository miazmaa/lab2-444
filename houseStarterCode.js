"use strict";

var canvas;
var gl;



var points = [
    //House Body
    vec4(-2.5, 0.0, 1.0, 1.0),
    vec4(2.5, 0.0, 1.0, 1.0),
    vec4(2.5, 2.0, 1.0, 1.0),
    vec4(-2.5, 2.0, 1.0, 1.0),
    //Roof
    vec4(-3.0, 2.0, 1.0, 1.0),
    vec4(0.0, 3.0, 1.0, 1.0),
    vec4(3.0, 2.0, 1.0, 1.0),
    //Window
    vec4(-2, 1.7, 0.9, 1.0),
    vec4(-1, 1.7, 0.9, 1.0),
    vec4(-1, 1.1, 0.9, 1.0),
    vec4(-2, 1.1, 0.9, 1.0),
    //Door
    vec4(-1, 0.0, 0.9, 1.0),
    vec4(1.0, 0.0, 0.9, 1.0),
    vec4(1.0, 1, 0.9, 1.0),
    vec4(-1.0, 1, 0.9, 1.0),
    //Diamond
    vec4(0.0, 2.0, 0.9, 1.0),
    vec4(0.5, 1.5, 0.9, 1.0),
    vec4(0.0, 1, 0.9, 1.0),
    vec4(-0.5, 1.5, 0.9, 1.0)
];

var colors = [
    //House Body
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0),
    //Roof
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),

    //Window
    vec4(1.0,1.0,1.0,1.0),
    vec4(1.0,1.0,1.0,1.0),
    vec4(1.0,1.0,1.0,1.0),
    vec4(1.0,1.0,1.0,1.0),
    //Door
    vec4(0.55, 0.27, 0.07, 1.0),
    vec4(0.55, 0.27, 0.07, 1.0),
    vec4(0.55, 0.27, 0.07, 1.0),
    vec4(0.55, 0.27, 0.07, 1.0),
    //Diamond
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 0.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0)
    
];

var numVertices  = points.length;
var down = true;
var ty = 0;
// Shader transformation matrices
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var eye, at, up;

var number=1;

var theta=0;
var theta2=0;

var down=false;
var ty=0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	
    at = vec3(0.0, 0.0, 0.0);
    up = vec3(0.0, 1.0, 0.0);
    eye = vec3(0.0, 0.0, 1.5);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	//Create your color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	//Create your vertex buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//Model and Projection Buffers
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	//Set up Ortho Projections
    projectionMatrix = ortho(-4, 4, 0, 4, 1, -1);
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );


    render();
}

function drawHouse(){
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLES, 4, 3);
}

function drawWindows(){
    gl.drawArrays(gl.TRIANGLE_FAN, 7, 4);
}

function drawEntrance(){
    gl.drawArrays(gl.TRIANGLE_FAN, 11, 4);
}

function drawDiamond(){
    gl.drawArrays(gl.TRIANGLE_FAN, 15, 4);
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    drawHouse();
    modelViewMatrix = mult(lookAt(eye, at, up), translate(0.0, ty, 0.0));
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    drawEntrance();
    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    drawWindows();
    drawDiamond();
    modelViewMatrix = mult(lookAt(eye, at, up), translate(3.0, 0.0, 0.0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    drawWindows();
    modelViewMatrix = mult(lookAt(eye, at, up),translate(-0.5, -0.5, 0.0));
    modelViewMatrix = mult(modelViewMatrix,scalem(0.75, 0.75, 1.0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false,flatten(modelViewMatrix));
    drawWindows();
    modelViewMatrix = mult(lookAt(eye, at, up),translate(3, -0.5, 0.0));
    modelViewMatrix = mult(modelViewMatrix,scalem(0.75, 0.75, 1.0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false,flatten(modelViewMatrix));
    drawWindows();
    if ( down == true){
        ty = ty -.01;
        if (ty <= -1.1 ){
            down = false;
        }
    }
    if ( down == false){
        ty = ty +.01;
        if (ty >=0.0 ){
            down = true;
        }
    }
    window.requestAnimationFrame(render);
}
