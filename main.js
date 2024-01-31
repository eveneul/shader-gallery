import * as THREE from "three";

const container = document.getElementById("app");
const sizes = { width: window.innerWidth, height: window.innerHeight };
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(sizes.width, sizes.height);
container.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 0, 50);
camera.fov = Math.atan(sizes.height / 2 / 50) * (180 / Math.PI) * 2;

/**
 * Object
 */

const textureLoader = new THREE.TextureLoader();

const img = document.querySelector("img");
const { width, height, top, left } = img.getBoundingClientRect();

const geomatry = new THREE.PlaneGeometry(width, height, 16, 16);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: textureLoader.load(img.src) },
    uHover: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {

      vUv = uv;

      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;

    uniform sampler2D uTexture;

  
    void main () {

      float distance = length(vUv - 0.5);
      vec2 wave = vec2(sin(distance), cos(distance));
      vec2 newuv = vUv + wave * 0.5;

      vec4 tex = texture2D(uTexture, newuv);
      gl_FragColor = tex;
    }
  `,
});

const mesh = new THREE.Mesh(geomatry, material);
mesh.position.x = -sizes.width / 2 + width / 2 + left;
mesh.position.y = sizes.height / 2 - height / 2 - top;
scene.add(mesh);

function tick() {
  renderer.render(scene, camera);
  camera.updateProjectionMatrix();
  requestAnimationFrame(tick);
}

tick();
