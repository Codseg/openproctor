'use client';  // Ensure this is a client-side component

import { useEffect, useRef, useState } from 'react';
import { Proctor } from '../lib';  // Import the SDK
import * as blazeface from '@tensorflow-models/blazeface';  // Import BlazeFace from TensorFlow.js

const HomePage = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null); // Ref for the camera video element
    const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for the canvas to draw face boxes
    const [isProctoringActive, setProctoringActive] = useState(false); // State to track if proctoring is active
    const [blazeFaceModel, setBlazeFaceModel] = useState<blazeface.BlazeFaceModel | null>(null); // Store the BlazeFace model

    // Load the BlazeFace model when the component mounts
    useEffect(() => {
        const loadModel = async () => {
            const model = await blazeface.load();
            setBlazeFaceModel(model);
        };

        loadModel();
    }, []);

    // Detect faces from the camera stream
    const detectFaces = async () => {
        if (videoRef.current && blazeFaceModel) {
            const ctx = canvasRef.current!.getContext('2d');
            const video = videoRef.current;

            // Set canvas dimensions to match the video size
            canvasRef.current!.width = video.width;
            canvasRef.current!.height = video.height;

            // Perform face detection every 100 milliseconds
            setInterval(async () => {
                const predictions = await blazeFaceModel.estimateFaces(video, false);

                // Clear previous drawings on the canvas
                ctx!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

                // If faces are detected, draw bounding boxes
                if (predictions.length > 0) {
                    predictions.forEach((prediction: any) => {
                        const [x, y, width, height] = prediction.topLeft.concat(prediction.bottomRight);

                        // Draw a rectangle around the detected face
                        ctx!.beginPath();
                        ctx!.rect(x, y, width - x, height - y);
                        ctx!.lineWidth = 2;
                        ctx!.strokeStyle = 'red';
                        ctx!.stroke();
                    });
                }
            }, 100);
        }
    };

    // Handler for starting the proctoring and face detection
    const handleStart = () => {
        setProctoringActive(true);  // Mark proctoring as active
        Proctor.setup({
            onVideoFrame: (cameraStream: MediaStream) => {
                // Attach the camera stream to the video element
                if (videoRef.current) {
                    videoRef.current.srcObject = cameraStream;  // Attach MediaStream to the video element
                    videoRef.current.play();  // Play the video

                    // Start face detection
                    detectFaces();
                }
            },
            onAudioStream: (audioStream) => {
                console.log('Audio stream received:', audioStream);
            },
            onScreenStream: (screenStream: MediaStream) => {
                // Handle screen sharing stream if needed
            },
            onTabSwitch: () => {
                console.log('Tab switch detected!');
                alert('You switched tabs! Please return to the test.');
            }
        });
    };

    // Handler for stopping the proctoring
    const handleStop = () => {
        console.log('Proctoring stopped.');
        setProctoringActive(false);  // Mark proctoring as inactive
        Proctor.stopCamera();
        Proctor.stopMicrophone();
        Proctor.stopScreenShare();

        // Ensure that video elements are cleaned up to release the camera and screen sharing
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    return (
        <div>
            <h1>Proctoring SDK Test - Camera, Screen Share, and Audio Feed with Face Detection</h1>
            <p>Check the console for proctoring activity and tab switch detection.</p>

            {/* Display the camera feed */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <video
                    ref={videoRef}
                    width="640"
                    height="480"
                    autoPlay
                    style={{ border: '1px solid black', marginTop: '20px' }}
                ></video>
                {/* Canvas to draw face detection boxes */}
                <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            </div>

            {/* Start and Stop Buttons */}
            {!isProctoringActive ? (
                <button
                    onClick={handleStart}
                    style={{ marginTop: '20px', padding: '10px', backgroundColor: 'green', color: 'white' }}
                >
                    Start Proctoring
                </button>
            ) : (
                <button
                    onClick={handleStop}
                    style={{ marginTop: '20px', padding: '10px', backgroundColor: 'red', color: 'white' }}
                >
                    Stop Proctoring
                </button>
            )}
        </div>
    );
};

export default HomePage;
