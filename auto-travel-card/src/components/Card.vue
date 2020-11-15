<template>
  <img class="img" ref="img">
</template>

<script>


export default {
  name: 'Card',
  props: {
    url: String,
    pos: Object,
    fontSize: Number,
  },
  mounted() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.init();
  },
  methods: {
    init() {
      let base = new Image();
      base.src = this.url;
      base.onload = () => {
        this.canvas.width = base.width;
        this.canvas.height = base.height;
        this.ctx.drawImage(base, 0, 0);
        this.cover();
        this.copy();
      };
    },
    cover() {
      let pos = this.pos || {x: 195, y: 520, width: 370, height: 40};
      let args = [pos.x, pos.y,pos.width, pos.height];
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(...args);
      this.ctx.font = `${this.fontSize || 28}px sans-serif` ;
      this.ctx.fillStyle = '#999';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(`更新于: ${this.now()}`, pos.x, pos.y);
    },
    now() {
      let now = new Date();
      now = new Date(now.getTime() - Math.random() * 90000)
      let year = now.getFullYear();
      let mon = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let min = now.getMinutes();
      let sec = now.getSeconds();

      function fmt(v) {
        v = v + '';
        if (v.length === 1) {
          v = '0' + v;
        }
        return v;
      }

      return `${fmt(year)}.${fmt(mon)}.${fmt(day)} ${fmt(hour)}:${fmt(min)}:${fmt(sec)}`;
    },
    copy() {
      let img = this.$refs.img;
      img.src = this.canvas.toDataURL('image/png');

    }
  }
}
</script>
<style>
  .img {
    width: 80vw;
    height: auto;
  }
</style>
