// lib/camera.ts
import { VideoStreamHandler } from '../types/proctor';

// Function to initialize the camera and get the MediaStream
export const initCamera = (): Promise<VideoStreamHandler> => {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                resolve({
                    stream,
                    stop: () => {
                        // Ensure that all video tracks are stopped
                        stream.getTracks().forEach((track) => {
                            if (track.readyState === 'live') {
                                track.stop();
                            }
                        });
                    }
                });
            })
            .catch(reject);
    });
};
