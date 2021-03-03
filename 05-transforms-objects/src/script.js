import './style.css'
import * as THREE from 'three'





// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()



/**
 * Objects
 */
//const geometry = new THREE.BoxGeometry(1, 1, 1)
//const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
//const mesh = new THREE.Mesh(geometry, material)
//scene.add(mesh)


const group = new THREE.Group()
group.position.y = -0.1
group.position.x = -1.4
group.scale.x = 1.7
group.rotation.x =  0.1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5,0.5,0.5),
    new THREE.MeshBasicMaterial({color: 0xff0000 })
)
cube1.position.x = - 0.25

group.add(cube1)




const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.75,0.75,0.75),
    new THREE.MeshBasicMaterial({color: 'blue' })
)

cube2.position.x = 1
group.add(cube2)



const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5,0.5,0.5),
    new THREE.MeshBasicMaterial({color: 'yellow' })
)

cube3.position.x = 2
group.add(cube3)


//Position

//mesh.position.x = 1
//mesh.position.y = -0.75
//mesh.position.z = -1.15
//mesh.position.set(1,1.15,-1.15)



//Scale

//mesh.scale.x = 2
//mesh.scale.y = 1.15
//mesh.scale.z = 0.25
//mesh.scale.set(1.25,2,0.45)



//Rotation

//mesh.rotation.reorder('XYZ')
//mesh.rotation.y = 1
//mesh.rotation.x = Math.PI // or  3.141592653589793

//mesh.position.normalize()
//console.log('mesh is ====>',mesh.position.length())






//Axes to visualize x,y,z axis
const axesHelper = new THREE.AxesHelper(1.25)
axesHelper.position.x = -1.25
axesHelper.position.y = 0.3
scene.add(axesHelper)




/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}



/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


//camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)