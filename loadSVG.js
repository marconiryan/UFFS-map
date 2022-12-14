import * as THREE from 'three';


import { SVGLoader } from 'three/addons/SVGLoader.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';




const scene = new THREE.Scene();
const ratio = window.innerWidth / window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true});
const camera = new THREE.PerspectiveCamera(100, ratio, 0.01, 10000000);
const controls = new OrbitControls( camera, renderer.domElement );

renderer.setClearColor( 0x000000, 0 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );
camera.position.z = 300;

controls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, LEFT: THREE.MOUSE.PAN }
controls.screenSpacePanning = true;
controls.addEventListener( 'change', render );
document.querySelector("body").appendChild(renderer.domElement);

window.addEventListener('resize', function(e) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

loadSVG('./models/svg/main.svg')



function loadSVG( url ) {

	const loader = new SVGLoader();
	loader.load( url, function ( data ) {
		const paths = data.paths;
		const group = new THREE.Group();
		group.scale.multiplyScalar( 0.25 );
		group.position.x = - 70;
		group.position.y = 70;
		group.scale.y *= - 1;
		for ( let i = 0; i < paths.length; i ++ ) {

			const path = paths[ i ];
			const fillColor = path.userData.style.fill;
			const material = new THREE.MeshBasicMaterial( {
				color: new THREE.Color().setStyle( fillColor ).convertSRGBToLinear(),
				opacity: path.userData.style.fillOpacity,
				transparent: true,
				depthWrite: false,
			} );

			const shapes = SVGLoader.createShapes( path );

			for ( let j = 0; j < shapes.length; j ++ ) {

				const shape = shapes[ j ];
				let geometry
				if(!!path.userData.node.id){
					geometry = new THREE.ExtrudeGeometry(shape, {
						steps: 16,
						depth: 16,
					});
				}
				else{
					geometry = new THREE.ShapeGeometry( shape );
				}
				
				const mesh = new THREE.Mesh( geometry, material );

				group.add( mesh );

			}
		
		}

		scene.add( group );

		render();

	} );

}

function render() {			
	renderer.render( scene, camera );

}
