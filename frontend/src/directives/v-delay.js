export default {
    beforeMount(el, binding) {
        const { seconds, onUpdate, onComplete } = binding.value;

        let remainingSeconds = seconds;
        onUpdate(remainingSeconds);

        const interval = setInterval(() => {
            remainingSeconds -= 1;
            onUpdate(remainingSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(interval);
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }
        }, 1000);

        el.__interval__ = interval;
    },
    beforeUnmount(el) {
        clearInterval(el.__interval__);
    }
};
