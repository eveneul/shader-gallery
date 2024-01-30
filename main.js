import * as THREE from "three";
import gui from "lil-gui";
import gsap from "gsap";

const sizes = { width: window.innerWidth, height: window.innerHeight };

const scene = new THREE.Scene();
const container = document.querySelector("#app");
const canvas = document.createElement("canvas");
canvas.width = sizes.width;
canvas.height = sizes.height;
container.appendChild(canvas);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);

/**
 * Create Object
 */

function createImages() {
  const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
    void main () {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 0.1);
    }`,
    fragmentShader: `
    void main () {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }`,
  });

  const geomatry = new THREE.PlaneGeometry(0.5, 0.5, 16, 16);

  const mesh = new THREE.Mesh(geomatry, material);

  return mesh;
}

const clock = new THREE.Clock();

const render = () => {
  const object = createImages();
  scene.add(object);
};

const tick = () => {
  requestAnimationFrame(tick);
  render();
  renderer.render(scene, camera);
};

tick();
