<template>
  <div class="container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
    <div class="box">Box 3</div>
    <div class="box">Box 4</div>
    <div class="box">Box 5</div>
    <div class="box">Box 6</div>
    <div class="box">Box 7</div>
    <div class="box">Box 8</div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: 0 auto;
  gap: 10px;
}

.box {
  background-color: lightblue;
  border: 1px solid #000;
  padding: 20px ;
  aspect-ratio: 1 / 1;
  text-align: center;
  flex: 1 0 calc(50% - 10px);
  box-sizing: border-box;
}

.box:nth-child(odd) {
  margin-right: 10px;
}
</style>