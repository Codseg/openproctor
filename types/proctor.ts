// types/proctor.ts

export interface ProctorOptions {
    onVideoFrame?: (imageData: MediaStream) => void;
    onAudioStream?: (audioStream: MediaStream) => void;
    onScreenStream?: (screenStream: MediaStream) => void;
    onTabSwitch?: () => void;
    videoElement?: HTMLVideoElement;  // Add video element for face detection
    canvasElement?: HTMLCanvasElement; // Add canvas element for drawing face boxes
}

export interface VideoStreamHandler {
    stream: MediaStream;
    stop: () => void;
}

export interface ScreenStreamHandler {
    stream: MediaStream;
    stop: () => void;
}  
