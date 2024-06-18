<template>
  <div>
    <div class="normaltext" v-if="dailys.length != 0">
      <label>
        <input type="checkbox">
      </label>
      <div>
        <p>{{ dailys[Math.floor(Math.random() * dailys.length)].description }}</p>
      </div>
      <div v-if="showDate" class="datum-box">
        <p id="datum">Datum</p>
        <p id="Uhrzeit">Uhrzeit</p>
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
    }
  },
  mounted() {
    fetch('http://localhost:3000/dailys?selected=true')
      .then(res => res.json())
      .then(data => this.dailys = data)
      .catch(err => console.log(err.message));
  },
}
</script>

<style scoped>
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

.normaltext div {
  width: 80%;
  display: flex;
  justify-content: center;
}

.datum-box {
  flex: 0 0 100%;
  align-items: center;
  padding: 10px 0px;
}

#datum {
  margin: auto;
  margin-left: 5%;
}
#Uhrzeit {
  margin: auto;
  margin-right: 5%;
}
</style>