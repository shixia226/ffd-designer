import VTool from '../common/v-tool';

Vue.component('widget-text', {
    template: `<span :style="{color:vcolor, fontSize: vfontsize, lineHeight: vlineheight}">{{vtext}}</span>`,
    props: ['color', 'fontsize', 'lineheight'],
    editor: `
        <editor-text label="Text" name="vtext" :value="text"></editor-text>
        <editor-text label="Color" name="vcolor" :value="color"></editor-text>
        <editor-text label="FontSize" name="vfontsize" :value="fontsize"></editor-text>
        <editor-text label="LineHeight" name="vlineheight" :value="lineheight"></editor-text>
    `,
    save(vm, html, space) {
        html = html || [];
        html.push(space, vm.vtext);
        return html;
    },
    data() {
        return {
            vcolor: this.color,
            vfontsize: this.fontsize,
            vlineheight: this.lineheight,
            vtext: VTool.text(this.$slots) || 'Text'
        }
    }
})