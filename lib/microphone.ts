// lib/microphone.ts

export const initMicrophone = async (): Promise<MediaStream> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw error;
    }
};

export const stopMicrophone = (stream: MediaStream): void => {
    stream.getTracks().forEach((track) => track.stop());
};
