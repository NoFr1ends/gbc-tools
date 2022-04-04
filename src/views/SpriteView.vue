<template>
<div>
  <Dialog header="Source code" v-model:visible="showSourceCode">
    <Textarea :modelValue="sourceFile" rows="10" cols="50"></Textarea>
  </Dialog>

  <div style="display: flex">
    <div style="border-right: 1px solid black; padding-right: 50px">
      <div class="tile" :class="{border: showBorder}" v-if="selectedPalette != null">
        <span class="row" v-for="y in 8" :key="y">
          <span class="pixel"
                v-for="x in 8"
                :data-y="y"
                :data-x="x"
                :key="x"
                :style="{backgroundColor: selectedPalette.colors[pixels[x + y * 8]]}"
                @click="pixels[x + y * 8] = selectedColor; save()" />
        </span>
      </div>

      <Button style="margin-top: 20px" label="Generate source file" @click="showSourceCode = true" />
    </div>

    <div style="padding-left: 50px" class="palette-view">
      <b>Current palette: </b>
      <Dropdown :options="palettes" optionLabel="label" v-model="selectedPalette" />

      <div class="palette" v-if="selectedPalette != null">
        <span v-for="(color, i) in selectedPalette.colors"
              class="pixel"
              :class="{active: i === selectedColor}"
              :style="'background-color: ' + color"
              :key="i"
              @click="selectedColor = i"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
  },
})
export default class SpriteView extends Vue {
  pixels = [];
  selectedPalette = null;
  showBorder = false;
  showSourceCode = false;
  palettes = [
    {
      id: 1,
      label: 'Default palette',
      colors: ['rgb(34, 35, 35)', 'rgb(194, 194, 205)', 'rgb(126, 126, 143)', 'rgb(96, 96, 112)']
    }
  ];
  selectedColor = 0;

  created() {
    this.selectedPalette = this.palettes[0];

    if(localStorage.getItem('tile')) {
      this.pixels = JSON.parse(localStorage.getItem('tile'));
    } else {
      this.pixels.length = 8 * 8;
      this.pixels.fill(0, 0, 8 * 8);
    }
  }

  get sourceFile() {
    let str = 'unsigned char tile[] = {\n';

    for(let y = 0; y < 8; y++) {
      let byte1 = 0;
      let byte2 = 0;

      for(let x = 0; x < 8; x++) {
        const id = this.pixels[x + y * 8];

        byte1 |= ((id & 1) === 1 ? 1 : 0) << x;
        byte2 |= ((id & 2) === 2 ? 1 : 0) << x;

        console.log(id, byte1, byte2);
      }

      str += '0x' + byte1.toString(16) + ', 0x' + byte2.toString(16) + ', \n';
    }

    str += '};';
    return str;
  }

  save() {
    localStorage.setItem('tile', JSON.stringify(this.pixels));
  }
}
</script>

<style scoped>
  .row {
    display: block;
    margin: 0;
    padding: 0;
    height: 16px;
  }

  .pixel {
    width: 16px;
    height: 16px;
    display: inline-block;
    position: relative;
  }

  .tile.border .pixel {
    border-top: 1px solid black;
    border-left: 1px solid black;
  }

  .pixel:hover:after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .tile.border .row .pixel:last-child {
    border-right: 1px solid black;
  }

  .tile.border .row:last-child .pixel {
    border-bottom: 1px solid black;
  }

  .palette-view .pixel {
    display: block;
    border: 1px solid black;
    border-bottom: 0;
  }

  .palette-view .pixel:last-child {
    border-bottom: 1px solid black;
  }

  .pixel.active {
    border: 1px solid goldenrod;
    margin-bottom: -1px;
  }

  .palette-view .pixel.active:last-child {
    border-bottom: 1px solid goldenrod;
  }
</style>