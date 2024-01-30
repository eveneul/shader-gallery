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

async function loadImages() {
  // 로드한 이미지 데이터를 넘길 수 있게 작업
  const images = [...document.querySelectorAll("img")];
  // 배열처럼, 배열에 있는 이미지 element를 사용할 수 있음

  const fetchedImges = images.map((img) => {
    return new Promise((resolve, reject) => {
      img.onload = resolve(img);
      img.onerror = reject;
    });
  });

  const loadedImg = await Promise.all(fetchedImges);
  // Promise.all => 안에 모든 Promise가 resolve가 되었는지 확인하고 넘겨 줌
  // 그리고 그 밑에 있는 코드가 실행되도록
  return loadedImg;
}

function createImages(images) {
  console.log(images);

  const imagesMeshes = images.map((img) => {
    const { width, height, top, left } = img.getBoundingClientRect();
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
  });

  return imagesMeshes;
}

const clock = new THREE.Clock();

const render = async () => {
  const loadedImages = await loadImages();
  const object = createImages([...loadedImages]);
  // console.log(object);
  scene.add(...object);
};

const tick = () => {
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

const init = async () => {
  await render();
  tick();
};

init().then();
