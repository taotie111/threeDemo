// import {
//   PlaneGeometry,
//   Scene,
//   PerspectiveCamera,
//   WebGLRenderer,
//   Object3D,
//   Clock,
//   AnimationMixer,
//   Color,
//   AmbientLight,
//   DirectionalLight,
//   GridHelper,
//   AxesHelper,
//   Material,
//   Vector3,
//   BoxGeometry,
//   MeshBasicMaterial,
//   CylinderGeometry,
//   MeshLambertMaterial,
//   Mesh,
//   Vector2,
//   TextureLoader,
//   CircleGeometry,
//   cloneUniformsGroups,
//   ArrowHelper,
//   CurvePath,
//   BufferGeometry,
//   LineBasicMaterial,
//   Line,
//   SplineCurve,
//   PointLightShadow,
//   Matrix4,
//   Matrix3,
// } from "three";
import * as THREE from "three";
// import * as TWEEN from "@tweenjs/tween.js";
 
type cameraPosition = {
  x: number;
  y: number;
  z: number;
};

/**
 * Class camera
 */
export class CameraControl {
    public camera: THREE.PerspectiveCamera;
    constructor(position,view,size) {                     // 构造器
      this.camera = this.createCamera(position,view,size);
    }
    private createCamera(position: cameraPosition,view: number,size: number){
      let camera = new THREE.PerspectiveCamera(view,size);
      camera.position.set(position.x,position.y,position.z);
      return camera;
    }

    public forward() {
      const cameraDirection = new THREE.Vector3();
      this.camera.getWorldDirection(cameraDirection); // 获取相机的朝向向量
    
      const distance = 1; // 前进的距离
      const delta = cameraDirection.multiplyScalar(distance); // 根据相机朝向和距离计算前进的位移向量
    
      this.camera.position.add(delta); // 将位移向量应用到相机的位置上
    }

    public backward() {
      const cameraDirection = new THREE.Vector3();
      this.camera.getWorldDirection(cameraDirection); // 获取相机的朝向向量
    
      const distance = 0.01; // 后进的距离
      const delta = cameraDirection.multiplyScalar(-distance); // 根据相机朝向和距离计算前进的位移向量
    
      this.camera.position.add(delta); // 将位移向量应用到相机的位置上
    }
    public turnLeft(angle) {
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(angle); // 创建一个绕Y轴旋转的矩阵
    
      this.camera.applyMatrix4(rotationMatrix); // 将旋转矩阵应用到相机的变换矩阵上
    }
    
    public turnRight( angle) {
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationY(-angle); // 创建一个绕Y轴反向旋转的矩阵
    
      this.camera.applyMatrix4(rotationMatrix); // 将旋转矩阵应用到相机的变换矩阵上
    }
    
}
