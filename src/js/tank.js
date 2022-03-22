class Tank {

    constructor(scene) {
        this.inputStates = {};
        this.createTank(scene);
        this.createCannon(scene);
        this.tankEvent();
    }

    createTank(scene) {
        this.tank = new BABYLON.MeshBuilder.CreateBox("heroTank", {
            height: 1,
            depth: 6,
            width: 6
        }, scene);

        let tankMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
        tankMaterial.diffuseColor = new BABYLON.Color3.Red;
        tankMaterial.emissiveColor = new BABYLON.Color3.Blue;
        this.tank.material = tankMaterial;

        // By default the box/tank is in 0, 0, 0, let's change that...
        this.tank.position.y = 0.6;
        this.tank.speed = 0.4;
        this.tank.frontVector = new BABYLON.Vector3(0, 0, 1);
    }

    createCannon(scene) {
        let cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 5, 1, 1, 6, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        let box = BABYLON.MeshBuilder.CreateBox("box", {
            height: 1,
            depth: 4,
            width: 4
        }, scene);

        this.turret = box;

        cylinder.parent = box;
        box.parent = this.tank;
        box.position.y = this.tank.position.y + 1;

        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3.Random;
        boxMaterial.emissiveColor = new BABYLON.Color3.Random;
        box.material = boxMaterial;

        let cylinderMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        cylinderMaterial.diffuseColor = new BABYLON.Color3.Random;
        cylinderMaterial.emissiveColor = new BABYLON.Color3.Random;
        cylinder.material = cylinderMaterial;

        cylinder.position.z = this.tank.position.z + 2;
        cylinder.rotation.x = Math.PI / 2;
        cylinder.move = () => {
            //tank.position.z += -1; // speed should be in unit/s, and depends on
            // deltaTime !

            // if we want to move while taking into account collision detections
            // collision uses by default "ellipsoids"

            let yMovement = 0;

            if (cylinder.position.y > 2) {
                zMovement = 0;
                yMovement = -2;
            }

            if (this.inputStates.fireLeft) {

                box.rotation.y -= 0.01;
                box.frontVector = new BABYLON.Vector3(Math.sin(box.rotation.y), 0, Math.cos(box.rotation.y));
            }
            if (this.inputStates.fireRight) {

                box.rotation.y += 0.01;
                box.frontVector = new BABYLON.Vector3(Math.sin(box.rotation.y), 0, Math.cos(box.rotation.y));
            }
        }
    }

    moveTank() {
        this.xMovement = 0;
        this.yMovement = 0;
        this.zMovement = 0;

        if (this.tank.position.y > 2) {
            this.zMovement = 0;
            this.yMovement = -2;
        }

        if (this.inputStates.up) {
            this.tank.moveWithCollisions(this.tank.frontVector.multiplyByFloats(this.tank.speed, this.tank.speed, this.tank.speed));
        }
        if (this.inputStates.down) {
            this.tank.moveWithCollisions(this.tank.frontVector.multiplyByFloats(-this.tank.speed, -this.tank.speed, -this.tank.speed));
        }
        if (this.inputStates.left) {
            this.tank.rotation.y -= 0.02;
            this.tank.frontVector = new BABYLON.Vector3(Math.sin(this.tank.rotation.y), 0, Math.cos(this.tank.rotation.y));
        }
        if (this.inputStates.right) {
            this.tank.rotation.y += 0.02;
            this.tank.frontVector = new BABYLON.Vector3(Math.sin(this.tank.rotation.y), 0, Math.cos(this.tank.rotation.y));
        }
    }


    moveTurret() {
        if (this.inputStates.fireLeft) {
            this.turret.rotation.y -= 0.01;
            this.turret.frontVector = new BABYLON.Vector3(Math.sin(this.turret.rotation.y), 0, Math.cos(this.turret.rotation.y));
        }
        if (this.inputStates.fireRight) {
            this.turret.rotation.y += 0.01;
            this.turret.frontVector = new BABYLON.Vector3(Math.sin(this.turret.rotation.y), 0, Math.cos(this.turret.rotation.y));
        }
    }

    tankEvent() {
        this.inputStates.left = false;
        this.inputStates.right = false;
        this.inputStates.up = false;
        this.inputStates.down = false;
        this.inputStates.space = false;

        this.inputStates.fireLeft = false;
        this.inputStates.fireRight = false;
        this.inputStates.fireUp = false;
        this.inputStates.fireDown = false;
        this.inputStates.fireSpace = false;

        window.addEventListener('keydown', (event) => {
            if ((event.key === "q") || (event.key === "Q")) {
                this.inputStates.left = true;
            } else if ((event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = true;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.inputStates.right = true;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.inputStates.down = true;
            } else if (event.key === " ") {
                this.inputStates.space = true;
            }
        }, false);

        window.addEventListener('keyup', (event) => {
            if ((event.key === "q") || (event.key === "Q")) {
                this.inputStates.left = false;
            } else if ((event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = false;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.inputStates.right = false;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.inputStates.down = false;
            } else if (event.key === " ") {
                this.inputStates.space = false;
            }
        }, false);

        window.addEventListener('keydown', (event) => {
            if ((event.key === "ArrowLeft")) {
                this.inputStates.fireLeft = true;
            } else if ((event.key === "ArrowUp")) {
                this.inputStates.fireUp = true;
            } else if ((event.key === "ArrowRight")) {
                this.inputStates.fireRight = true;
            } else if ((event.key === "ArrowDown")) {
                this.inputStates.fireDown = true;
            } else if (event.key === " ") {
                this.inputStates.fireSpace = true;
            }
        }, false);

        //if the key will be released, change the states object
        window.addEventListener('keyup', (event) => {
            if ((event.key === "ArrowLeft")) {
                this.inputStates.fireLeft = false;
            } else if ((event.key === "ArrowUp")) {
                this.inputStates.fireUp = false;
            } else if ((event.key === "ArrowRight")) {
                this.inputStates.fireRight = false;
            } else if ((event.key === "ArrowDown")) {
                this.inputStates.fireDown = false;
            } else if (event.key === " ") {
                this.inputStates.fireSpace = false;
            }
        }, false);
    }

}

export default Tank;