<template>
  <div class="container">
    <div v-for="box in boxes" :key="box.id" class="box normaltext selectionbox" :class="{ isSelected: box.isSelected }"
      @click="selectFocus(box.id)">
      <div class="content">
        <img :src="box.imageUrl" alt="sdfswef">
        {{ box.name }}
      </div>
    </div>
  </div>
  <button class="mainButton buttontext" @click="handleButtonClick()">Fertig</button>

</template>

<script>
export default {
  data() {
    return {
      boxes: [
        { id: 1, name: 'Sport', imageUrl: '/src/assets/Icons/Sports.png', isSelected: false },
        { id: 2, name: 'Ernährung', imageUrl: '/src/assets/Icons/Nutrition.png', isSelected: false },
        { id: 3, name: 'Digital Detox', imageUrl: '/src/assets/Icons/Detox.png', isSelected: false },
        { id: 4, name: 'Freunde', imageUrl: '/src/assets/Icons/Friends.png', isSelected: false },
        { id: 5, name: 'Mentale Gesundheit', imageUrl: '/src/assets/Icons/Mindful.png', isSelected: false },
        { id: 6, name: 'Lernen', imageUrl: '/src/assets/Icons/Learn.png', isSelected: false },
        { id: 7, name: 'Hobby', imageUrl: '/src/assets/Icons/Hobby.png', isSelected: false },
        { id: 8, name: 'Sparen', imageUrl: '/src/assets/Icons/Saving.png', isSelected: false },
      ]
    }
  },
  methods: {
    selectFocus(id) {
      this.boxes.forEach(box => {
        box.isSelected = false;
      });
      const box = this.boxes.find(box => box.id === id);
      if (box) {
        box.isSelected = true;
      }
    },
    handleButtonClick() {
      this.boxes.forEach(box => {
        if (box.isSelected) {
          console.log('Fokus ' + box.name + ' gewählt');
        }
      });
      this.$router.push({ name: 'home' })
    }
  },
}
</script>

<style scoped>
.content {
  margin: auto 25px;
}

.content img {
  width: 100%;
  height: auto;
  display: block;
}

.container {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* width: 80%; */
  /* margin: 0 auto; */
  /* gap: 30px; */
}

.box {
  flex: 0 0 calc(50% - 40px);
  box-sizing: border-box;
  display: flex;
  min-width: 120px;
  max-width: 200px;
  margin: 20px;
}

.box.isSelected {
  border: 2px solid var(--tama-color-orange);
}

/* .box:nth-child(odd) {
  margin-right: 10px;
} */
</style>