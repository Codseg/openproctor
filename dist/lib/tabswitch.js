// lib/tabSwitch.ts
export const detectTabSwitch = (onTabSwitch) => {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            onTabSwitch();
        }
    });
};
