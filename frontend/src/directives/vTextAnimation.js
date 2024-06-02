const getRandomChar = () => String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1) + 33));

const useTextAnimation = (el, text, speed) => {
    const stringStore = Array(text.length).fill(' ');

    let updateInterval;
    let timeouts = [];

    const clearPreviousAnimation = () => {
        if (updateInterval) clearInterval(updateInterval);
        timeouts.forEach(timeout => clearTimeout(timeout));
        timeouts = [];
    };

    const addCharWithDelay = () => {
        let currentCharIndex = 0;

        updateInterval = setInterval(() => {
            if (currentCharIndex < text.length) {
                stringStore[currentCharIndex] = getRandomChar();
                el.innerText = stringStore.join('');
            }
        }, 200);

        for (let i = 0; i < text.length; i++) {
            const timeout = setTimeout(() => {
                stringStore[i] = text[i];
                el.innerText = stringStore.join('');
                currentCharIndex++;
            }, speed * (i + 1));
            timeouts.push(timeout);
        }

        const finalTimeout = setTimeout(() => {
            clearInterval(updateInterval);
        }, text.length * speed);
        timeouts.push(finalTimeout);
    };

    clearPreviousAnimation();
    addCharWithDelay();

    return clearPreviousAnimation;
};

const vTextAnimation = {
    mounted(el, binding) {
        const { text, speed } = binding.value;
        el._clearPreviousAnimation = useTextAnimation(el, text, speed); // Store the clear function
    },
    updated(el, binding) {
        const { text, speed } = binding.value;
        if (el._clearPreviousAnimation) {
            el._clearPreviousAnimation(); // Clear previous animations
        }
        el._clearPreviousAnimation = useTextAnimation(el, text, speed); // Store the new clear function
    },
    beforeUnmount(el) {
        if (el._clearPreviousAnimation) {
            el._clearPreviousAnimation(); // Clear any running intervals or timeouts when the element is unmounted
        }
    }
};

export default vTextAnimation;
