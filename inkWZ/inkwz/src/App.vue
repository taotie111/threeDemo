<template>
  <canvas id="webgl"></canvas>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three';
import * as dat from 'lil-gui'

// import gsap from 'gsap'
onMounted(
    () => {
  const image = new Image()

  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load('/zhaoshangBlank.jpg')
  image.onload = () => {
    texture.needsUpdate = true
  }
  const canvas = document.getElementById('webgl')
  console.log('canvas',canvas)
  const scene = new THREE.Scene()
  // const group = new THREE.Group()
  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 1),
    new THREE.MeshBasicMaterial({ map: texture })
  )
  // const cube2 = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // )
  // const cube3 = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({ color: 0x0000ff })
  // )
  // cursor 
  // window.addEventListener('mousemove', (event) => {
  //   console.log('event',event)
  //   const x = event.clientX / window.innerWidth - 0.5
  //   const y = event.clientY / window.innerHeight - 0.5
  //   camera.position.x = x * 10
  //   camera.position.y = y * 10
  //   // camera.lookAt(cube1.position)
  // })
  scene.add(cube1)

  // debug
  const gui = new dat.GUI()
  gui.add(cube1.position, 'x', -3, 3, 0.01)
  gui.addColor(cube1.material, 'color')
  const sizes = {
    width: 800,
    height: 600
  }
  const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height)
  camera.position.x = 2
  camera.position.y = 0 
  camera.position.z = 2
  // camera.lookAt(group.position)
  scene.add(camera)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  const clock=new THREE.Clock();
  renderer.setSize(sizes.width, sizes.height)
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
  
    // camera.position.y = Math.sin(elapsedTime) * 4
    camera.position.x = Math.sin(elapsedTime ) * 2  
    camera.position.z = Math.cos(elapsedTime) * 2  
    window.requestAnimationFrame(tick);
    camera.lookAt(cube1.position)
    renderer.render(scene, camera)
  }
  tick()
  // renderer.render(scene, camera)

})

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
