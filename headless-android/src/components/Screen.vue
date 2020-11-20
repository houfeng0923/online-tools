<template>
<img :src="snapshoot" :style="style"  @mousedown="swipe" @mouseup="swipe" draggable="false"/>
<div>
  <button @click="key(3, 'home')">home</button>
  <button @click="key(4, 'back')">back</button>
  <button @click="key(164, 'mute')">mute</button>
  <button @click="key(164, 'mute')">mute</button>
  <button @click="reboot">reboot</button>
</div>
</template>

<script>
import snapshoot from '../assets/snapshoot.png';

export default {
  name: 'Screen',
  props: {
    msg: String
  },
  data() {
    return {
      snapshoot,
      style: {
        width: 1080 / 3 + 'px'
      }
    }
  },
  methods: {
    reboot() {
      this.$http.get('/shell/reboot');
    },
    key(code) {
      this.$http.get('/shell/keyevent', {code});
    },
    swipe(e) {
      if (e.type === 'mousedown' && !this.swipe1) {
        const { offsetX, offsetY } = e;
        this.swipe1 = { x: offsetX * 3, y: offsetY * 3 };
      }
      if (e.type === 'mouseup' && this.swipe1) {
        const swipe1 = this.swipe1;
        const { offsetX, offsetY } = e;
        const swipe2 = { x: offsetX * 3, y: offsetY * 3 };
        if (swipe1.x === swipe2.x && swipe1.y === swipe2.y) {
          this.$http.get('/shell/tap', { x: offsetX * 3, y: offsetY * 3 });
        } else {
          this.$http.get('/shell/swipe', { x1: swipe1.x, y1: swipe1.y,  x2: swipe2.x, y2: swipe2.y });
        }

        this.swipe1 = null;
      }
    }
  }
}
</script>
