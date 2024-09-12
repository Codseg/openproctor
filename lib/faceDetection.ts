import * as blazeface from '@tensorflow-models/blazeface';

export class FaceDetection {
  private model: blazeface.BlazeFaceModel | null = null;

  // Load the BlazeFace model
  public async loadModel(): Promise<void> {
    if (!this.model) {
      this.model = await blazeface.load();
    }
  }

  // Detect faces from a video element and draw bounding boxes on the canvas
  public async detectFaces(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    if (!this.model) {
      console.error('BlazeFace model is not loaded.');
      return;
    }

    const ctx = canvasElement.getContext('2d');
    const displaySize = { width: videoElement.width, height: videoElement.height };

    // Set canvas dimensions to match the video size
    canvasElement.width = displaySize.width;
    canvasElement.height = displaySize.height;

    // Perform face detection every 100ms
    setInterval(async () => {
      const predictions = await this.model!.estimateFaces(videoElement, false);

      // Clear previous drawings on the canvas
      ctx!.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Draw bounding boxes around detected faces
      predictions.forEach((prediction: any) => {
        const [x, y] = prediction.topLeft;
        const [width, height] = prediction.bottomRight;

        // Draw a rectangle around the detected face
        ctx!.beginPath();
        ctx!.rect(x, y, width - x, height - y);
        ctx!.lineWidth = 2;
        ctx!.strokeStyle = 'red';
        ctx!.stroke();
      });
    }, 100);
  }
}
