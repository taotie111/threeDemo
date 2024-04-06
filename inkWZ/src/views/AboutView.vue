<template>
  <canvas class="webgl"></canvas>
</template>
<script setup>
import { onMounted } from 'vue';
import * as THREE from 'three';
import * as GeoTIFF from "geotiff";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createControls } from './controls/controls'
import { CameraControl } from './controls/keywordControls'
// import setupTerrainModel from './TerrainControl/terrainControl'
import * as dat from 'lil-gui'
console.log(123)
// 需要在挂载完成后再
onMounted(() => {
  const canvas = document.querySelector('.webgl');
  const scene = new THREE.Scene()

  // sizes
  const canvasSizes = {
    width: 800,
    height: 600
  }

  const sizes = {
    width: 800,
    height: 600
  }
  // TEXT

  // Light 
  const ambientLight = new THREE.AmbientLight("#fff", 1);
  scene.add(ambientLight);

  // 红色的正方形
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: "red"
  })
  const mesh1 = new THREE.Mesh(geometry, material);
  scene.add(mesh1);

  // camera
  const cameraPosition = {
    x: 100,
    y: 600,
    z: 600
  }
  const cameraControl = new CameraControl(cameraPosition, 150, sizes.width / sizes.height);
  const camera = cameraControl.camera;
  console.log(camera, 'camera');
  camera.lookAt(mesh1.position);
  scene.add(camera);


  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })

  var control = createControls(camera, renderer.domElement);
  control.target.set(0, 0, 0);
  /**
   * 
   */
  const readGeoTif = async () => {
    const rawTiff = await GeoTIFF.fromUrl("./平原区dem.tif");
    const tifImage = await rawTiff.getImage();
    const image = {
      width: tifImage.getWidth(),
      height: tifImage.getHeight()
    }
    const geometry = new THREE.PlaneGeometry(
      image.width,
      image.height,
      image.width - 1,
      image.height - 1
    );
    geometry.rotateX(- Math.PI / 2);
    const vertices = geometry.attributes.position.array;
    const data = await tifImage.readRasters({ interleave: true });
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      if (!isNaN(data[i]) && data[i] > -10) {
        vertices[j + 1] = data[i];
      } else {
        vertices[j + 1] = 0;
      }

    }
    const texture = new THREE.CanvasTexture(generateTexture(data, image.width, image.height));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));

    scene.add(mesh);
    // camera.lookAt(10, 10, 10)
    // Fill z values of the geometry
    console.time("parseGeom");
    // console.log('data', data)
    //遍历顺序：从左至右，从上至下
    // for (let i = 0; i < posAttr.count; i++) {
    //   const elevation = data[i];
    //   posAttr.array[3 * i + 2] = elevation/50;

    //   const color = mapElevationToColor(elevation);
    //   colorAttr.array[3 * i] = color.r;
    //   colorAttr.array[3 * i + 1] = color.g;
    //   colorAttr.array[3 * i + 2] = color.b;
    // }

    // const colorsArr = [];
    // const miny = -5;//y最小值
    // const height = 100
    // console.log(posAttr)
    // const count = posAttr.count;
    // const c1 = new THREE.Color(0x000000);//山谷颜色
    // const c2 = new THREE.Color(0xffffff);//山顶颜色
    // for (let i = 0; i < count; i++) {
    //     //当前高度和整体高度比值
    //     const percent = (data[i] - miny) / height;
    //     posAttr.array[i * 3 + 1] = percent;
    //     const c = c1.clone().lerp(c2, percent);//颜色插值计算
    //     colorsArr.push(c.r, c.g, c.b); 
    // }
    // const colors = new Float32Array(colorsArr);
    // geometry.computeVertexNormals();
    // // 设置几何体attributes属性的颜色color属性
    // var material = new THREE.MeshLambertMaterial({
    //   color: 0xCAA066,
    //   side: THREE.DoubleSide,
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    // mesh.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
    // scene.add(mesh);
    renderer.render(scene, camera);
    console.timeEnd("parseGeom");
  };

  function generateTexture(data, width, height) {

    // bake lighting into texture

    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - width * 2] - data[j + width * 2];
      vector3.normalize();

      shade = vector3.dot(sun);

      imageData[i] = (90 + shade * 128) * (0.5 + data[j] * 0.007);
      imageData[i + 1] = (115 + shade * 96) * (0.5 + data[j] * 0.007);
      imageData[i + 2] = (116 + shade * 96) * (0.5 + data[j] * 0.007);

    }

    context.putImageData(image, 0, 0);

    // Scaled 4x
    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);
    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
      const v = ~ ~(Math.random() * 5);
      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;

  }
  // 2. 计算每个顶点的颜色值
  // 创建底部网格，使用平面Geometry和材质MeshBasicMaterial
  // const gridGeometry = new THREE.PlaneGeometry(10000, 10000); // 创建一个100x100的平面
  // const gridMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide }); // 创建材质，双面显示，颜色为灰色
  // const grid = new THREE.Mesh(gridGeometry, gridMaterial);

  // // 将底部网格放置在地面位置
  // grid.position.set(0, -10, 0); // 将平面放置在y轴-10的位置，以模拟底部
  // scene.add(grid);
  readGeoTif();

  // 鼠标控制摄像头
  // 初始化鼠标状态
  const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    down: false
  };
  const delta = {
    x: 0,
    y: 0
  };
  function onMouseMove(event) {
    // 阻止默认的鼠标行为，比如滚动页面
    event.preventDefault();
    console.log(123);
    // 设置鼠标位置，用于计算移动的差值
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // 更新摄像机的旋转
    camera.rotation.y += 0.001 * Math.PI;
    // 更新鼠标的当前位置
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    renderer.render(scene, camera);
  }
  // 添加事件监听器
  // window.addEventListener('mousemove', onMouseMove, false);
  // setupTerrainModel()
  renderer.setSize(canvasSizes.width, canvasSizes.height)
  renderer.render(scene, camera);
    // 移动监听
    function move() {
    document.addEventListener('keydown', function (event) {
      const key = event.key; // 获取按下的键
      console.log(key, 'key');
      switch (key) {
        case 'w': cameraControl.forward(); break;
        case 's': cameraControl.backward(); break;
        case 'a': cameraControl.turnLeft(0.1); break;
        case 'd': cameraControl.turnRight(0.1); break;
      }
      renderer.render(scene, camera);
    });

  }
  move();
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    control.update(); // 更新controls
  }
  animate();
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
