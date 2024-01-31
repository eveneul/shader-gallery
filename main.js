import * as THREE from "three";
import gui from "lil-gui";
import gsap from "gsap";
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});

const container = document.querySelector("#app");

container.appendChild(renderer.domElement);

const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasSize.width / canvasSize.height, 0.1, 100);
camera.position.set(0, 0, 50);
camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;

const imageRepository = [];

const loadImages = async () => {
  const images = [...document.querySelectorAll(" img")];

  const fetchImages = images.map(
    (image) =>
      new Promise((resolve, reject) => {
        image.onload = resolve(image);
        image.onerror = reject;
      })
  );

  const loadedImages = await Promise.all(fetchImages);

  return loadedImages;
};

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

const create = async () => {
  const loadedImages = await loadImages();
  const images = createImages([...loadedImages]);
  console.log(images);
  scene.add(...images);
};

const resize = () => {
  // canvasSize.width = window.innerWidth;
  // canvasSize.height = window.innerHeight;

  // camera.aspect = canvasSize.width / canvasSize.height;
  // camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.width, canvasSize.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

const retransform = () => {
  imageRepository.forEach(({ img, mesh }) => {
    const { width, height, top, left } = img.getBoundingClientRect();
    const { width: originWidth } = mesh.geometry.parameters;

    const scale = width / originWidth;
    mesh.scale.x = scale;
    mesh.scale.y = scale;

    mesh.position.y = canvasSize.height / 2 - height / 2 - top;
    mesh.position.x = -canvasSize.width / 2 + width / 2 + left;
  });
};

const addEvent = () => {
  window.addEventListener("resize", resize);
};

const draw = () => {
  renderer.render(scene, camera);
  retransform();

  requestAnimationFrame(() => {
    draw();
  });
};

const initialize = async () => {
  await create();
  // addEvent();
  resize();
  draw();
};

initialize().then();
