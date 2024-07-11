/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
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
