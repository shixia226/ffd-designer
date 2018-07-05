import VTool from '../common/v-tool';

Vue.component('widget-text', {
    template: `<span :style="{color:vcolor, fontSize: vfontSize}">{{vtext}}</span>`,
    props: ['color', 'fontSize'],
    editor: `
        <editor-text label="Text" name="vtext" :value="text"></editor-text>
        <editor-text label="Color" name="vcolor" :value="color"></editor-text>
        <editor-text label="FontSize" name="vfontSize" :value="fontSize"></editor-text>
    `,
    save(vm, html, space) {
        html = html || [];
        html.push(space, vm.vtext);
        return html;
    },
    data() {
        return {
            vcolor: this.color,
            vfontSize: this.fontSize,
            vtext: VTool.text(this.$slots) || 'Text'
        }
    }
})