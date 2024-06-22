<script setup>
import CustomCheckbox from '../CustomCheckbox.vue';
</script>

<template>
  <div class="daily">
    <div class="normaltext" v-if="dailys.length != 0">
      <custom-checkbox class="checkbox" @input="handleCheckboxInput"></custom-checkbox>
      <div :class="{ 'strikethrough': isChecked }" class="textWrapper">
        <p>{{ dailys[Math.floor(Math.random() * dailys.length)].description }}</p>
      </div>
      <div v-if="showDate" class="datum-box smalltextAdditionalinfo">
        <p id="datum">{{ currentDate }}</p>
        <p id="Uhrzeit">00:00 - 24:00 Uhr</p>
      </div>
    </div>
    <div v-else>
      <p>Daily wird geladen</p>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    showDate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dailys: [],
      currentDate: '',
      isChecked: false,
    }
  },
  mounted() {
    fetch('http://localhost:3000/dailys?selected=true')
      .then(res => res.json())
      .then(data => this.dailys = data)
      .catch(err => console.log(err.message));
    this.updateDate();
  },
  methods: {
    updateDate() {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    },
    handleCheckboxInput(data) {
      this.isChecked = data;
    }
  }
}
</script>

<style scoped>
.daily {
  margin-top: 10px;
}

label {
  display: flex;
  justify-content: center;
  width: 10%;
}

.normaltext {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  /* justify-content: center; */
  border-radius: 8px;
  background-color: var(--tama-color-orange);
  max-width: 300px;
  width: 100%;
  min-height: 47px;
  margin: auto;

}

.textWrapper {
  width: 70%;
  display: flex;
  justify-content: center;
  padding: 10px 0px;
}

.datum-box {
  flex: 0 0 100%;
  display: flex;

  align-items: center;
  justify-content: center;
  padding: 10px 0px;
  padding-top: 5px;
}

#datum {
  margin: auto;
  margin-left: 5%;
}

#Uhrzeit {
  margin: auto;
  margin-right: 5%;
}

.strikethrough {
  text-decoration: line-through;
  color: var(--tama-color-gray);
}
</style>