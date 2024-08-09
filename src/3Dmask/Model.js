// Model.js
import React, { useEffect, useState } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';

const Model = ({ modelUrl, mtlUrl }) => {
    const [model, setModel] = useState(null);
    console.log(modelUrl);
    console.log('잘실행되는거야???????????')

    useEffect(() => {
        console.log("Loading model...1");
        const loadModel = async () => {
            console.log("Loading model...2");
            const mtlLoader = new MTLLoader();
            console.log("Loading model...3");
            mtlLoader.load(mtlUrl, (materials) => {
                console.log("Loading model...4");
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(modelUrl, (object) => {
                    console.log("Model loaded", object);
                    setModel(object);
                },
                    undefined, // onProgress callback
                    console.log('Loading model...5'),
                    (error) => {
                        console.error("Error loading OBJ model:", error);
                    }
                );
            },
                undefined, // onProgress callback
                (error) => {
                    console.error("Error loading MTL file:", error);
                }
            );
        };
        loadModel();
    }, [modelUrl, mtlUrl]);

    return model ? <primitive object={model} /> : null;
};

const ThreeScene = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <perspectiveCamera position={[0, 0, 5]} />
            <Model modelUrl="./Rombi.obj" mtlUrl="./Rombi.mtl" />
        </Canvas>
    );
};

export default ThreeScene;
