<template>
  <div class="backdrop">
    <div id="placeholder" @click.self="handleCloseBackdrop"></div>
    <div class="tileWrapper">
      <div class="textWrapper">
        <h1 class="subheadlineBlack"> {{ taskName }}</h1>
        <p class="normaltextInfo">markieren als</p>
      </div>
      <div v-for="tile in tiles" :key="tile.id" class="box normaltext selectionbox" @click="handleTileClick(tile.id)">
        {{ tile.name }}
      </div>
      <div class="buttonWrapper">
        <button id="closeButton" @click="handleCloseBackdrop"></button>
        <!-- <button id="confirmButton"></button> -->
      </div>
    </div>

  </div>

</template>

<script>

export default {
  props: {
    taskName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      tiles: [
        { id: 1, name: 'Fertig', imageUrl: '' },
        { id: 2, name: 'Bearbeiten', imageUrl: '' },
        { id: 3, name: 'Verschieben', imageUrl: '' },
        { id: 4, name: 'Löschen', imageUrl: '' },
      ]
    }
  },
  methods: {
    handleCloseBackdrop() {
      this.$emit('backdropClicked')
    },
    handleTileClick(id) {
      const tile = this.tiles.find(tile => tile.id === id);
      if (tile) {
        handleTileFunktion(tile);
      }
    },

  },
}

function handleTileFunktion(tile) {
  switch (tile.id) {
        case 1:
          console.log(tile.name);
          break;
        case 2:
          console.log(tile.name);
          break;
        case 3:
          console.log(tile.name);
          break;
        case 4:
          console.log(tile.name);
          break;

        default:
          break;
      }
}
</script>

<style scoped>
.textWrapper {
  width: 100%;
}

.normaltextInfo {
  text-align: center;
}

.box {
  flex: 0 0 calc(40% - 40px);
  max-width: 25%;
  min-width: 100px;
  box-sizing: border-box;
  display: flex;
  margin: 5px;
  justify-content: center;
  align-items: center;
}

.selectionbox {
  border-color: var(--tama-color-black);
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

.tileWrapper {
  flex: 1;
  background-color: white;
  border: 4px solid var(--tama-color-orange);
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  justify-content: center;
  align-items: first baseline;
  overflow: hidden;
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: flex-end;
  padding: 10px 20px;
}

input[type="date"] {
  color: #333;
  background-color: #fff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>