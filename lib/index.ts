// lib/index.ts
import { initCamera } from './camera';
import { initMicrophone, stopMicrophone } from './microphone';
import { initScreenShare } from './screenshare';
import { detectTabSwitch } from './tabswitch';
import { FaceDetection } from './faceDetection';
import { ProctorOptions, VideoStreamHandler, ScreenStreamHandler } from '../types/proctor';

export class Proctor {
    private static videoHandler?: VideoStreamHandler;
    private static screenHandler?: ScreenStreamHandler;
    private static microphoneStream?: MediaStream;
    private static faceDetection: FaceDetection = new FaceDetection();

    // Static setup method to initialize camera, microphone, screen share, and tab switch detection
    public static setup(options: ProctorOptions) {
        // Initialize camera if the video callback is provided
        if (options.onVideoFrame) {
            initCamera()
                .then(async handler => {
                    Proctor.videoHandler = handler;
                    if (options.onVideoFrame) {
                        options.onVideoFrame(handler.stream);
                    }

                    // Load the face detection model and start face detection
                    await Proctor.faceDetection.loadModel();
                    if (options.videoElement && options.canvasElement) {
                        Proctor.faceDetection.detectFaces(options.videoElement, options.canvasElement);
                    }
                })
                .catch(error => {
                    console.error('Error initializing camera:', error);
                });
        }

        // Initialize microphone if the audio callback is provided
        if (options.onAudioStream) {
            initMicrophone()
                .then(stream => {
                    Proctor.microphoneStream = stream;
                    if (options.onAudioStream) {
                        options.onAudioStream(stream);
                    }
                })
                .catch(error => {
                    console.error('Error initializing microphone:', error);
                });
        }

        // Initialize screen sharing if the screen callback is provided
        if (options.onScreenStream) {
            initScreenShare()
                .then(handler => {
                    Proctor.screenHandler = handler;
                    if (options.onScreenStream) {
                        options.onScreenStream(handler.stream);
                    }
                })
                .catch(error => {
                    console.error('Error initializing screen sharing:', error);
                });
        }

        // Detect tab switch if the callback is provided
        if (options.onTabSwitch) {
            detectTabSwitch(options.onTabSwitch);
        }
    }

    // Stop camera stream
    public static stopCamera() {
        if (Proctor.videoHandler) {
            Proctor.videoHandler.stop();
        }
    }

    // Stop microphone stream
    public static stopMicrophone() {
        if (Proctor.microphoneStream) {
            stopMicrophone(Proctor.microphoneStream);
        }
    }

    // Stop screen sharing stream
    public static stopScreenShare() {
        if (Proctor.screenHandler) {
            Proctor.screenHandler.stop();
        }
    }
}
