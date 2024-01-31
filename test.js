import * as THREE from "three";
import gui from "lil-gui";
import gsap from "gsap";

const renderer = new THREE.WebGLRenderer({ alpha: true });
const container = document.getElementById("app");
container.appendChild(renderer.domElement);
const sizes = { width: window.innerWidth, height: window.innerHeight };
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
renderer.setSize(sizes.width, sizes.height);
camera.position.set(0, 0, 50);
camera.fov = Math.atan(sizes.height / 2 / 50) * (180 / Math.PI) * 2;
async function loadImages() {
  const images = [...document.querySelectorAll("img")];
  const fetchImages = images.map((item) => {
    return new Promise((resolve, reject) => {
      item.onload = resolve(item);
      item.onerror = reject;
    });
  });

  const loadedImages = await Promise.all(fetchImages);
  return loadedImages;
}

const createImages = (images) => {
  const imageMeshes = images.map((image) => {
    const { width, height } = image.getBoundingClientRect();
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `

    varying vec2 vUv;

      void main() {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

        vUv = uv;
      }
    `,
      fragmentShader: `
    varying vec2 vUv;

      void main() {
        gl_FragColor = vec4(vUv, 1.0, 1.0);
      }`,
      side: THREE.DoubleSide,
    });
    const geometry = new THREE.PlaneGeometry(width, height, 16, 16);
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  });

  return imageMeshes;
};

async function create() {
  const loadedImages = await loadImages();
  const images = createImages([...loadedImages]);
  console.log(images);
  scene.add(...images);
}

function render() {
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

async function init() {
  await create();
  camera.updateProjectionMatrix();

  render();
}

init().then();
