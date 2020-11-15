<template>
  <Card :url="me"/>
  <Card :url="mi" :pos="miPos" :fontSize="fontSize" />
</template>

<script>
import Card from './components/Card.vue';

import me from './assets/base.png';
import mi from './assets/mi.jpg';

export default {
  name: 'App',
  components: {
    Card
  },
  data() {
    return {
      me,
      mi,
      miPos: {
        x: 285, y: 778, width: 580, height: 50
      },
      fontSize: 40
    }
  }
}
</script>
