<template>
  <div class="backdrop" @click.self="handleCloseBackdrop">
    <form>
      <label>Aufgabe</label>
      <input type="text" placeholder="Beschreibe deine Aufgabe"> 
      <label>Wiederholen</label>
      <select>
        <option value="Nie">Nie</option>
        <option value="Täglich">Täglich</option>
        <option value="Wöchentlich">Wöchentlich</option>
      </select>
      <label>Fälligkeit</label>
      <select>
        <option value="Heute">Heute</option>
        <option value="Morgen">Morgen</option>
        <option value="Nächste Woche">Nächste Woche</option>
      </select>
      <label>Kategorie</label>
      <select>
        <option value="studium">Studium</option>
        <option value="arbeit">Arbeit</option>
        <option value="fitness">Fitness</option>
      </select>
    </form>
  <button id="closeButton" @click="handleCloseBackdrop">X</button>
  <button id="confirmButton">O</button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      openAddTask: false,
    }
  },
  methods: {
    handleCloseBackdrop() {
      this.$emit('backdropClicked', this.openAddTask)
    },
  },

}
</script>

<style scoped>
.backdrop {
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  text-align: center;
}

form {
  background-color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
}

label {
  display: block;
  margin: 5%;
}

#closeButton {
    position: fixed;
    bottom: 10px; /* Abstand vom unteren Rand */
    left: 10px; /* Abstand vom rechten Rand */
    /* Optional: Styling für den Button */
    padding: 10px 20px;
    background-color: rgb(255, 0, 0);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#confirmButton {
    position: fixed;
    bottom: 10px; /* Abstand vom unteren Rand */
    right: 10px; /* Abstand vom rechten Rand */
    /* Optional: Styling für den Button */
    padding: 10px 20px;
    background-color: rgb(0, 255, 13);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

</style>