import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { FlyControls } from 'three/addons/controls/FlyControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 2000);


const textureLoader = new THREE.TextureLoader();
const textures = [
  textureLoader.load('./images/sun.jpg'),
  textureLoader.load('./images/mercury.jpg'),// 4
  textureLoader.load('./images/vanus.jpg'),// 4
  textureLoader.load('./images/earth.jpg'),  // 1
  textureLoader.load('./images/moon.jpg'),   // 2
  textureLoader.load('./images/mars.jpg'),   // 3
  textureLoader.load('./images/jupiter.jpg'),
  textureLoader.load('./images/saturn.jpg'),
  textureLoader.load('./images/neptune.jpg'),
  textureLoader.load('./images/pluto.jpg')

];


const sunGeometry = new THREE.SphereGeometry(15, 32, 16);
const sunMaterial = new THREE.MeshStandardMaterial({ map: textures[0] });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);


const createOrbit = (radius) => {
  const curve = new THREE.EllipseCurve(
    0, 0, radius, radius, 0, 2 * Math.PI, false, 0
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  const orbit = new THREE.Line(geometry, material);
  orbit.rotation.x = Math.PI / 2; 
  return orbit;
};


const earthPivot = new THREE.Object3D();
scene.add(earthPivot);

const earthGroup = new THREE.Group();
const earthGeometry = new THREE.SphereGeometry(5, 32, 16);
const earthMaterial = new THREE.MeshStandardMaterial({ map: textures[3] });
const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
earthSphere.position.set(110, 0, 0);
earthGroup.add(earthSphere);

const moonPivot = new THREE.Object3D(); 
moonPivot.position.set(110, 0, 0); 
const moonGeometry = new THREE.SphereGeometry(1.5, 32, 16);
const moonMaterial = new THREE.MeshStandardMaterial({ map: textures[4] });
const moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);
moonSphere.position.set(10, 0, 0);
moonPivot.add(moonSphere);
earthGroup.add(moonPivot);  
earthPivot.add(earthGroup);


scene.add(createOrbit(110));


const planets = [
  { radius: 4, texture: textures[1], distance: 70, pivot: new THREE.Object3D() },
  { radius: 3, texture: textures[2], distance: 90, pivot: new THREE.Object3D() },
  { radius: 6, texture: textures[5], distance: 50, pivot: new THREE.Object3D() },
  { radius: 5, texture: textures[6], distance: 130, pivot: new THREE.Object3D() },
  { radius: 5, texture: textures[7], distance: 150, pivot: new THREE.Object3D() },
  { radius: 5, texture: textures[8], distance: 175, pivot: new THREE.Object3D() }

];

planets.forEach((planet) => {
  const planetGroup = new THREE.Group();
  const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 16);
  const planetMaterial = new THREE.MeshStandardMaterial({ map: planet.texture });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  planetMesh.position.set(planet.distance, 0, 0);
  planetGroup.add(planetMesh);

  planet.pivot.add(planetGroup);
  scene.add(planet.pivot);

  const planetOrbit = createOrbit(planet.distance);
  scene.add(planetOrbit);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
directionalLight.position.set(0, 0, 50).normalize();
scene.add(directionalLight);

camera.position.z = 200;



const canvas = document.querySelector('#draw');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; 
controls.minDistance = 50;      
controls.maxDistance = 500;    
controls.maxPolarAngle = Math.PI / 2;


function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);


  earthPivot.rotation.y += 0.01; 

  moonPivot.rotation.y += 0.005; 

  
  planets.forEach(planet => {
    planet.pivot.rotation.y += 0.005;  
  });

  sunMesh.rotation.y += 0.01;

  controls.update();
}

animate();
