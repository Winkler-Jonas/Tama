const getRandomChar = () => String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1) + 33));

export const useTextAnimation = (el, text) => {
    const stringStore = Array(text.length).fill(' ');

    const addCharWithDelay = () => {
        let currentCharIndex = 0;

        const updateInterval = setInterval(() => {
            if (currentCharIndex < text.length) {
                stringStore[currentCharIndex] = getRandomChar();
                el.innerText = stringStore.join('');
            }
        }, 200);

        for (let i = 0; i < text.length; i++) {
            setTimeout(() => {
                stringStore[i] = text[i];
                el.innerText = stringStore.join('');
                currentCharIndex++;
            }, 1000 * (i + 1));
        }

        setTimeout(() => {
            clearInterval(updateInterval);
        }, text.length * 1000);
    };

    addCharWithDelay();
};
