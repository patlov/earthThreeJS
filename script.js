const scene = new THREE.Scene();


// create the camera, which will be our perspective where
// we see the earth from
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
);

camera.position.z = 7;

// now we need the renderer to be able to display
// the earth
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas')});

// we will need some light to see something
// otherwise it will be black
scene.add(new THREE.AmbientLight(0x333333));

// lets add some directional light so it looks better
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// now set the position of the directionalLight
directionalLight.position.set(4, 3, 4);
scene.add(directionalLight);

// now we create the EarthMesh based on our image and
// the bumps on the image
// the bumpMap will help us to create a 3D looking Map, and the
// bumpScale determines how much we apply of the bumpMap, you will see
// it later
const earthMesh = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('images/1_earth_8k.jpg'),
    bumpMap: new THREE.TextureLoader().load('images/elev_bump_8k.jpg'),
    bumpScale: 0.1
});

// now we need for ThreeJS some geometry, because our earth is a sphere
// we will use spheregeometry

const earthGeometry = new THREE.SphereGeometry(2, 32, 32);

// this creates now our Earth which will be a sphere covered with the 
// images from the images folder, I showed in the beginning
const earth = new THREE.Mesh(earthGeometry, earthMesh);

// now we add it to the scene
scene.add(earth);

// forgot the Stars lets add them also!
const stars = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 4), new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('images/starfield.jpg'),
    side: THREE.BackSide
}));

scene.add(stars);

// add the size for the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// now show it
// lets make it rotate
function show() {
    requestAnimationFrame(show);
    earth.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

show();

// now I will disable the preview 
// and we will add the functionality for dragging and zooming
// into our earth

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

// this listens to when we press the mouse down, so we adjust the position
document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// now we add the listener for when we move the mouse
document.addEventListener("mousemove", (event) => {
    if(!isDragging) {
        return;
    }

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    const deltaRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
            toRadians(deltaMove.y),
            toRadians(deltaMove.x),
            0,
            'XYZ'
        )
    );

    earth.quaternion.multiplyQuaternions(
        deltaRotation,
        earth.quaternion
    );
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// this is the listener for when we stop dragging
document.addEventListener("mouseup", (event) => {
    isDragging = false;
});

// this is the eventlistener to be able to zoom in and out
document.addEventListener("wheel", (event) => {
    camera.position.z += event.deltaY * 0.01;
});

// we need a helper function to convert degrees to radians, so we can
// calculate properly the new position of the globe
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}



