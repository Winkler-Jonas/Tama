<template>
  <div class="custom-checkbox" @click="toggleCheckbox">
    <input type="checkbox" :checked="isChecked" @change="toggleCheckbox" />
    <span class="checkmark"></span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isChecked: this.value
    };
  },
  watch: {
    value(newValue) {
      this.isChecked = newValue;
    }
  },
  methods: {
    toggleCheckbox() {
      this.isChecked = !this.isChecked;
      this.$emit('input', this.isChecked);
    }
  }
}
</script>

<style scoped>
.custom-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
}

.custom-checkbox input {
  display: none;
}

.custom-checkbox .checkmark {
  background-color: transparent;
  border: 1px solid var(--tama-color-black);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  width: 40%;
  aspect-ratio: 1 / 1;
}

.custom-checkbox .checkmark::after {
  content: "\2714";
  width: 0.75em;
  height: 0.75em;
  color: var(--tama-color-gray);
  display: none;
}

.custom-checkbox input:checked + .checkmark {
  border-color: var(--tama-color-gray);
}

.custom-checkbox input:checked + .checkmark::after {
  display: block;
}
</style>