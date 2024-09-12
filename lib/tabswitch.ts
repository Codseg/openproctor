// lib/tabSwitch.ts

export const detectTabSwitch = (onTabSwitch: () => void): void => {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            onTabSwitch();
        }
    });
};
