export interface StreamUploaderOptions {
    videoStream: MediaStream;
    audioStream: MediaStream;
    screenStream: MediaStream;
    serverUrl: string; // URL of the server to upload the streams
    onDataAvailable?: (chunk: Blob) => void; // Optional callback for handling data chunks locally
}

export class StreamUploader {
    private videoRecorder: MediaRecorder | null = null;
    private audioRecorder: MediaRecorder | null = null;
    private screenRecorder: MediaRecorder | null = null;

    private serverUrl: string;

    constructor(private options: StreamUploaderOptions) {
        this.serverUrl = options.serverUrl;
    }

    // Initialize the recorders
    public init(): void {
        this.videoRecorder = this.createRecorder(this.options.videoStream, 'video');
        this.audioRecorder = this.createRecorder(this.options.audioStream, 'audio');
        this.screenRecorder = this.createRecorder(this.options.screenStream, 'screen');
    }

    // Create a media recorder for the given stream and type
    private createRecorder(stream: MediaStream, type: 'video' | 'audio' | 'screen'): MediaRecorder {
        const recorder = new MediaRecorder(stream);

        // Send data to the server or handle locally if needed
        recorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                this.sendDataToServer(event.data, type);
                if (this.options.onDataAvailable) {
                    this.options.onDataAvailable(event.data); // Optional local handling of chunks
                }
            }
        };

        return recorder;
    }

    // Start recording video, audio, and screen streams
    public start(): void {
        if (this.videoRecorder && this.audioRecorder && this.screenRecorder) {
            this.videoRecorder.start(1000); // Record video in chunks of 1 second
            this.audioRecorder.start(1000); // Record audio in chunks of 1 second
            this.screenRecorder.start(1000); // Record screen in chunks of 1 second
        } else {
            console.error('Recorders are not initialized.');
        }
    }

    // Stop recording video, audio, and screen streams
    public stop(): void {
        if (this.videoRecorder && this.audioRecorder && this.screenRecorder) {
            this.videoRecorder.stop();
            this.audioRecorder.stop();
            this.screenRecorder.stop();
        } else {
            console.error('Recorders are not initialized.');
        }
    }

    // Send the recorded data chunk to the server for storage
    private sendDataToServer(data: Blob, type: 'video' | 'audio' | 'screen'): void {
        const formData = new FormData();
        formData.append('file', data, `${type}-${Date.now()}.webm`);
        formData.append('type', type);

        fetch(this.serverUrl, {
            method: 'POST',
            body: formData,
        }).then((response) => {
            if (!response.ok) {
                console.error('Failed to upload data chunk:', response.statusText);
            }
        }).catch((error) => {
            console.error('Error uploading data:', error);
        });
    }
}
