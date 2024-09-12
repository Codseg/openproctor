// lib/microphone.ts
export const initMicrophone = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    }
    catch (error) {
        console.error('Error accessing microphone:', error);
        throw error;
    }
};
