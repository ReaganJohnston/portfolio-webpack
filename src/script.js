import './style.css'
import * as THREE from 'three'
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * Function which controls the main animation and calling of the moving stars
 * Handles the scroll animation
 * And overall compiler of preceding components
 */
const clock = new THREE.Clock()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector('#bg'),
// });
const canvas = document.querySelector('canvas.webgl')

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})


//Texture Loader
const loader = new THREE.TextureLoader();
const sphere = loader.load('./star.png');

//Renderer that augments the camera
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth , window.innerHeight);
camera.position.setZ(1);
renderer.render(scene, camera);

//Calls and constants to add in the custom torus into the threejs scene
const geometry = new THREE.TorusGeometry(10, 3, 20, 100 )
const material = new THREE.PointsMaterial({
  size: 0.005,
  map: sphere
})
const torus = new THREE.Points(geometry, material);
torus.position.setZ(-5);
scene.add(torus)

//Create a directional light positioned on the screen so the particles show up
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
pointLight.position.set(5, 5, 5)
scene.add(pointLight, ambientLight)

//Create the particles that make up the spacy-sky
const particles = new THREE.BufferGeometry;
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

//Display the particles randomally on the x and y axis for each reload
for (let i = 0; i < particlesCount; i++){
  posArray[i] = (Math.random() - 0.5) * 5
}

particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const particlesMesh = new THREE.Points(particles, material)
scene.add(particlesMesh);

//AnimateParticles function caller to be used inside the animate loader
function animateParticles(event){
  mouseY = event.clientY
  mouseX = event.clientX
}

//On mouse wheel, scroll down
function onMouseWheel(event){
  event.preventDefault();

  camera.position.z += event.deltaY * 0.0002;
  camera.position.clampScalar( 0, 1 );
}

//On window resize, adjust threejs components
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//Add event listener's that await cursor and scroll movement
document.addEventListener('wheel', onMouseWheel)
document.addEventListener('mousemove', animateParticles)
// document.getElementById('')
window.addEventListener('resize', onWindowResize)
let mouseX = 0
let mouseY = 0

//Final function to animate the whole webpage
function animate(){
  requestAnimationFrame( animate );

  // Get the elapsed time and use it as a variable to spin the particles
  const elapsedTime = clock.getDelta()
  particlesMesh.rotation.y += -.1 * elapsedTime


  //Utilise the user's mouse position to rotate the particles in a specific direction
  if( mouseX > 0){
    particlesMesh.rotation.x += - mouseY * (elapsedTime * 0.00012)
    particlesMesh.rotation.y += mouseX * (elapsedTime * 0.00012)
  }

  //Rotate the torus object
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();

