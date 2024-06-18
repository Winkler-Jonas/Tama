<template>
  <div class="backdrop">
    <div id="placeholder" @click.self="handleCloseBackdrop"></div>
    <form @submit.prevent="addTask">
      <label >
        <h1 class="subheadlineBlack">Aufgabe</h1>
      </label>
      <input class="normaltextInfo" type="text" v-model="newTask.description" id="description" required placeholder="Beschreibe deine Aufgabe">
      <label>
        <h1 class="subheadlineBlack">Wiederholen</h1>
      </label>
      <select class="normaltextInfo">
        <option value="Nie">Nie</option>
        <option value="Täglich">Täglich</option>
        <option value="Wöchentlich">Wöchentlich</option>
      </select>
      <label>
        <h1 class="subheadlineBlack">Fälligkeit</h1>
      </label>
      <input class="normaltextInfo" type="date" v-model="newTask.due_date" id="due_date">
      <label>
        <h1 class="subheadlineBlack">Kategorie</h1>
      </label>
      <select class="normaltextInfo" v-model="newTask.category" id="category">
        <option value="studium">Studium</option>
        <option value="arbeit">Arbeit</option>
        <option value="fitness">Fitness</option>
      </select>
      <div class="buttonWrapper">
        <button type="reset" id="closeButton" @click="handleCloseBackdrop"></button>
        <button type="submit" id="confirmButton"></button>
      </div>
    </form>

  </div>

</template>

<script>

export default {
  props: ['selectedDateForTask'],
  data() {
    return {
      newTask: {
        description: '',
        due_date: '',
        category: '',
        completed: false,
      },
      message: null
    }
  },
  methods: {
    handleCloseBackdrop() {
      this.$emit('backdropClicked')
    },
    async addTask() {
      try {
        const response = await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newTask)
        });

        if (!response.ok) {
          throw new Error('Fehler beim Hinzufügen der Aufgabe');
        }

        // const result = await response.json();
        this.message = 'Aufgabe erfolgreich hinzugefügt!';
        console.log(this.message);
        this.resetForm();
        this.handleCloseBackdrop();
      } catch (error) {
        this.message = 'Fehler: ' + error.message;
        console.log(this.message);

      }
    },
    resetForm() {
      this.newTask = {
        description: '',
        due_date: '',
        category: '',
        completed: false
      };
    }
  },
}
</script>

<style scoped>
.subheadlineBlack {
  text-align: left;
}
.backdrop {
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  flex-direction: column;
  background: rgb(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

#placeholder {
  flex: 1;
}

form {
  flex: 1;
  background-color: white;
  width: calc(100% - 8px);
  border: 4px solid var(--tama-color-orange);
  border-bottom: none;
  border-radius: 20px 20px 0 0;
}

label {
  display: block;
  margin: 5%;
  
}

#closeButton {
  border-radius: 50%;
  width: 45px;
  aspect-ratio: 1 / 1;
  border: none;
  color: var(--tama-color-white);
  background-color: var(--tama-color-orange);
  text-align: center;
  font-size: 150%;
}

#confirmButton {
  /* position: relative; */
  border-radius: 50%;
  width: 45px;
  aspect-ratio: 1 / 1;
  border: none;
  color: var(--tama-color-white);
  background-color: var(--tama-color-green);
  text-align: center;
  font-size: 150%;
}

#confirmButton::before {
  content: '\2714';
}

#closeButton::before {
  content: '\2716';
}

.buttonWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  padding: 10px 20px;
}

</style>