// Andrew Duerr
// CS 435
// April 8th, 2019
// The purpose of this project was to map textures with transparency.

var canvas;
var gl;

var numVertices  = 0;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var slide = [-3,-2,-1,0,1,2,3];
var slideindex = 0;


var texCoord = [
  vec2(0/2048     ,0/2048),       //0
  vec2(512/2048   ,0/2048),       //1
  vec2(1024/2048  ,0/2048),       //2
  vec2(1536/2048  ,0/2048),       //3
  vec2(2048/2048  ,0/2048),       //4
  vec2(0/2048     ,512/2048),     //5
  vec2(512/2048   ,512/2048),     //6
  vec2(1024/2048  ,512/2048),     //7
  vec2(1536/2048  ,512/2048),     //8
  vec2(2048/2048  ,512/2048),     //9
  vec2(0/2048     ,1024/2048),    //10
  vec2(512/2048   ,1024/2048),    //11
  vec2(1024/2048  ,1024/2048),    //12
  vec2(1536/2048  ,1024/2048),    //13
  vec2(2048/2048  ,1024/2048),    //14
  vec2(0/2048     ,1536/2048),    //15
  vec2(512/2048   ,1536/2048),    //16
  vec2(1024/2048  ,1536/2048),    //17
  vec2(1536/2048  ,1536/2048),    //18
  vec2(2048/2048  ,1536/2048),    //19
  vec2(0/2048     ,2048/2048),    //20
  vec2(512/2048   ,2048/2048),    //21
  vec2(1024/2048  ,2048/2048),    //22
  vec2(1536/2048  ,2048/2048),    //23
  vec2(2048/2048  ,2048/2048),    //24
];

var vertices = [
        vec4( -100, -100,  100, 1.0 ),
        vec4( -100,  100,  100, 1.0 ),
        vec4( 100,  100,  100, 1.0 ),
        vec4( 100, -100,  100, 1.0 ),
        vec4( -100, -100, -100, 1.0 ),
        vec4( -100,  100, -100, 1.0 ),
        vec4( 100,  100, -100, 1.0 ),
        vec4( 100, -100, -100, 1.0 ),
    ];

var backWall = [
        vec4( -100, -100, -100, 1.0 ),
        vec4( -50, -100, -100, 1.0),
        vec4( 50,  -100, -100, 1.0 ),
        vec4( 100,  -100, -100, 1.0 ),
        vec4( -100, -99, -100, 1.0), //4
        vec4( -50, -50, -100, 1.0),
        vec4( 50, -50, -100, 1.0),
        vec4( 100, -99, -100, 1.0), //7
        vec4( -100, 50, -100, 1.0),
        vec4( -50, 50, -100, 1.0),
        vec4( 50, 50, -100, 1.0),
        vec4( 100, 50, -100, 1.0),
        vec4( -100,  100, -100, 1.0 ),
        vec4( -50, 100, -100, 1.0),
        vec4( 50, 100, -100, 1.0 ),
        vec4( 100, 100, -100, 1.0 )
    ];

var bgSize = 100;
var bgDist = 200;

var bgVertices = [
  vec4( -bgSize, -bgSize,  bgDist, 1.0 ),
  vec4( -bgSize, bgSize,  bgDist, 1.0 ),
  vec4( bgSize,  bgSize,  bgDist, 1.0 ),
  vec4( bgSize, -bgSize,  bgDist, 1.0 ),
  vec4( -bgSize, -bgSize, -bgDist, 1.0 ),
  vec4( -bgSize,  bgSize, -bgDist, 1.0 ),
  vec4( bgSize,  bgSize, -bgDist, 1.0 ),
  vec4( bgSize, -bgSize, -bgDist, 1.0 ),
];


var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black   0
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red     1
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow  2
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green   3
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue    4
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta 5
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan    6
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white   7
    ];

var near = 0;
var far = 500;
var radius = 1.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var dist = 100.0;

var left = -dist;
var right = dist;
var ytop = dist;
var bottom = -dist;


var mvMatrix, pMatrix;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 100.0, 0.0);

// quad uses first index to set color for face

function quad(a, b, c, d, color) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[color]);
     numVertices += 6;
}

function bgQuad(a, b, c, d, color) {
     pointsArray.push(bgVertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(bgVertices[b]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(bgVertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(bgVertices[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(bgVertices[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(bgVertices[d]);
     colorsArray.push(vertexColors[color]);
     numVertices += 6;
}

function backQuad(a, b, c, d, color) {
     pointsArray.push(backWall[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(backWall[b]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(backWall[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(backWall[a]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(backWall[c]);
     colorsArray.push(vertexColors[color]);
     pointsArray.push(backWall[d]);
     colorsArray.push(vertexColors[color]);
     numVertices += 6;
}

function room(){
  quad(3,7,4,0,3);
  quad(1,5,4,0,1);
  // quad(4,7,6,5,4);
  quad(2,6,7,3,2);
  //== floor
  texCoordsArray.push(texCoord[23]);
  texCoordsArray.push(texCoord[18]);
  texCoordsArray.push(texCoord[19]);
  texCoordsArray.push(texCoord[23]);
  texCoordsArray.push(texCoord[19]);
  texCoordsArray.push(texCoord[24]);
  //== left wall
  texCoordsArray.push(texCoord[16]);
  texCoordsArray.push(texCoord[17]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[16]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[11]);
  //== back wall
  // texCoordsArray.push(texCoord[12]);
  // texCoordsArray.push(texCoord[17]);
  // texCoordsArray.push(texCoord[18]);
  // texCoordsArray.push(texCoord[12]);
  // texCoordsArray.push(texCoord[18]);
  // texCoordsArray.push(texCoord[13]);
  //== right wall
  texCoordsArray.push(texCoord[16]);
  texCoordsArray.push(texCoord[17]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[16]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[11]);
}

function bg(){
  bgQuad(4,5,6,7,4);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[7]);
  texCoordsArray.push(texCoord[6]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[6]);
  texCoordsArray.push(texCoord[11]);
}

function back(){
  backQuad(0,4,7,3,4); // bottom
  texCoordsArray.push(texCoord[15]);
  texCoordsArray.push(texCoord[20]);
  texCoordsArray.push(texCoord[21]);
  texCoordsArray.push(texCoord[15]);
  texCoordsArray.push(texCoord[21]);
  texCoordsArray.push(texCoord[16]);
  backQuad(4,12,15,7,4); // top
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[17]);
  texCoordsArray.push(texCoord[18]);
  texCoordsArray.push(texCoord[12]);
  texCoordsArray.push(texCoord[18]);
  texCoordsArray.push(texCoord[13]);
  // backQuad(6,10,11,7,4);
  // texCoordsArray.push(texCoord[12]);
  // texCoordsArray.push(texCoord[17]);
  // texCoordsArray.push(texCoord[18]);
  // texCoordsArray.push(texCoord[12]);
  // texCoordsArray.push(texCoord[18]);
  // texCoordsArray.push(texCoord[13]);
  // backQuad(8,12,15,11,4);
  // texCoordsArray.push(texCoord[12]);
  // texCoordsArray.push(texCoord[17]);
  // texCoordsArray.push(texCoord[18]);
  // texCoordsArray.push(texCoord[12]);
  // texCoordsArray.push(texCoord[18]);
  // texCoordsArray.push(texCoord[13]);
}

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA,
         gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

var arrow = { left: 37, up: 38, right: 39, down: 40 };

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    canvas.getContext('webgl',{premultipliedAlpha: false});
    canvas.getContext('webgl',{alpha: false});

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    // gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.clearColor(0.5, 0.5, 0.5, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, false);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    room();
    bg();
    back();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    var image = document.getElementById("texImage");

    window.addEventListener('keydown', function(event) {
        event.preventDefault();
        switch (event.keyCode) {
          case arrow.left:
            slideindex -= 1;
            if(slideindex < 0) {slideindex = 0;}
            break;
          case arrow.up:
            slideindex = 6;
            break;
          case arrow.right:
            slideindex += 1;
            if(slideindex > 6) {slideindex = 6;}
            break;
          case arrow.down:
            slideindex = 0;
            break;
        }
      });

    configureTexture( image );
    // console.log(gl.getContextAttributes());
    render();
}

var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius*Math.sin(phi+(dr*slide[slideindex])), radius*Math.sin(theta+(5.0 * Math.PI/180.0)),
             radius*Math.cos(phi+(dr*slide[slideindex])));

        mvMatrix = lookAt(eye, at , up);
        pMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

        // gl.clearColor(0.5, 0.5, 0.5, 1);
        // gl.colorMask(false, false, false, true);
        // gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
        requestAnimFrame(render);
    }
