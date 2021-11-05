
// some globals
var gl;


var delay = 100;
var direction = true;
var iBuffer;
var vBuffer;
var colorBuffer;
var program;

var vertexColors = [];

var offset = 0;

var width = 0.0;
var height = 0.0;

var orthoMat = [];


var eye = vec3(0,0,-1);
var at = vec3(0,0,0);
var up = vec3(0,1,0);

window.onload = function init() {

	// get the canvas handle from the document's DOM
    var canvas = document.getElementById( "gl-canvas" );
	height = canvas.height
	width = canvas.width
	// initialize webgl
    gl = WebGLUtils.setupWebGL(canvas);

	// check for errors
    if ( !gl ) { 
		alert("WebGL isn't available"); 
	}

    // set up a viewing surface to display your image
    gl.viewport(0, 0, canvas.width, canvas.height);

	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
    program = initShaders(gl, "vertex-shader", "fragment-shader");

	// make this the current shader program
    gl.useProgram(program);

	// Get a handle to theta  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
    thetaLoc = gl.getUniformLocation(program, "theta");

	colorLoc = gl.getUniformLocation(program, "vertColor");

	mvmLoc = gl.getUniformLocation(program, 'mvm');
	orthoLoc = gl.getUniformLocation(program, 'ortho')

	orthoMat = ortho(-100, 100, -100, 100, 200, -200);

	iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(teapot_indices), gl.STATIC_DRAW);

	vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(teapot_vertices), gl.STATIC_DRAW);
	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

    addColors();

	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW)
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
	gl.enableVertexAttribArray(vColor)

	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

    render();
};

function addColors(){
    for(let i = 0; i < teapot_vertices.length; i++){
        vertexColors.push([Math.random(), Math.random(), Math.random(), 1])
        vertexColors.push([Math.random(), Math.random(), Math.random(), 1])
        vertexColors.push([Math.random(), Math.random(), Math.random(), 1])
    }
}

function ortho(left, right, bottom, top, near, far){
	var M = mat4(
		vec4(1.0,0.0,0.0,0.0),
		vec4(0.0,1.0,0.0,0.0),
		vec4(0.0,0.0,0.0,0.0),
		vec4(0.0,0.0,0.0,1.0)
	)
	var N = mat4(
		vec4(2/(right-left),0.0,0.0,(-(right+left)/(right-left))),
		vec4(0.0,2/(top-bottom),0.0,(-(top+bottom)/(top-bottom))),
		vec4(0.0,0.0,-2/(far-near),((far+near)/(far-near))),
		vec4(0.0,0.0,0.0,1)
	)

	return mult(M, N)
}

function lookAt(eye, at , up){
	vpn = subtract(at, eye);
	n = normalize(vpn, false);
	console.log(n)

	preU = cross(up, n);
	u = normalize(preU,false);
	console.log(u)

	preV = cross(n, u)
	v = normalize(preV, false);

	return v
}

function render() {
	// this is render loop

	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(orthoLoc, false, flatten(orthoMat));

	//gl.uniform3fv(thetaLoc, theta);
	gl.drawElements(gl.TRIANGLES, 1500 , gl.UNSIGNED_BYTE, 0)

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}

function setCamera(input){
	switch(input){
		case '+X':
			eye = vec3(1,0,0);
			break;
		case '-X':
			eye = vec3(-1,0,0);
			break;
		case '+Y':
			eye = vec3(0,1,0);
			break;
		case '-Y':
			eye = vec3(0,-1,0);
			break;
		case '+Z':
			eye = vec3(0,0,1);
			break;
		case '-Z':
			eye = vec3(0,0,-1);
			break;
		case 'UL':
			eye = vec3(-1,1,0);
			break;
		case 'UR':
			eye = vec3(1,1,0);
			break;
		default:
			console.log("that aint it fam")
			break;
    }
}

