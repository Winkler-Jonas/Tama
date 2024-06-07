<template>
  <div class="backdrop" @click.self="handleClickOnBackdrop">
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
    handleClickOnBackdrop() {
      this.$emit('backdropClicked', this.openAddTask)
    }
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
</style> vba