<script setup>
import CustomCheckbox from '../CustomCheckbox.vue';
</script>

<template>
  <div class="aufgabe">
    <div>
      <div v-for="task in tasks" :key="task.id" class="normaltext" v-if="tasks.length != 0">
        <custom-checkbox class="checkbox" :value="task.completed" @input="handleCheckboxInput($event, task.id)"></custom-checkbox>
        <div :class="{ 'strikethrough': task.completed }" class="tasktext" @click="toogleEditTask(task)">
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
    updateTasks(task) {
      fetch('http://localhost:3000/tasks/' + task.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    handleCheckboxInput(input, id) {
      const foundTask = this.tasks.find(task => task.id === id);
      // this.isChecked = input;
      foundTask.completed = input;
      this.updateTasks(foundTask);
    }
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style scoped>
.aufgabe {
  margin-top: 10px;
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
  margin-top: 10px;
}




.tasktext {
  width: 70%;
  display: flex;
  justify-content: center;

}

.strikethrough {
  text-decoration: line-through;
  color: var(--tama-color-gray);
}
</style>