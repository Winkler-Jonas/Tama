<template>
  <div >
    <div>
      <div v-for="task in tasks" :key="task.id" class="normaltext" v-if="tasks.length != 0">
        <label>
          <input type="checkbox">
        </label>
        <div @click="toogleEditTask(task)">
          {{ task.description }}
        </div>
      </div>
      <p class="normaltextInfo" v-else>Nichts zu finden, drücke "+" und füge eine neue Aufgabe hinzu</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [],
    }
  },
  methods: {
    toogleEditTask(task) {
      this.$emit('openEditTask', task);
    },
    fetchData() {
      fetch('http://localhost:3000/tasks')
      .then(res => res.json())
      .then(data => this.tasks = data)
      .catch(err => console.log(err.message));
    },
  },
  mounted() {
    this.fetchData();
  },
}
</script>

<style scoped>

label {
  display: flex;
  justify-content: center;
  width: 10%;
}

.normaltextInfo {
  display: flex;
  max-width: 300px;
  width: 80%;
  margin: auto;
}

.normaltext {
  border: 1px solid var(--tama-color-black);
  border-radius: 8px;
  min-height: 47px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
  margin: auto;
}


.normaltext div {
  width: 80%;
  display: flex;
  justify-content: center;

}
</style>