import VTool from '../common/v-tool';

Vue.component('widget-text', {
    template: `<span :class="[display, block]" :style="{color:vcolor, fontSize: vfontsize, lineHeight: vlineheight}">{{vtext}}</span>`,
    props: ['color', 'block', 'display', 'fontsize', 'lineheight'],
    editor: `
        <editor-text label="Text" name="vtext" :value="text"></editor-text>
        <editor-text label="Color" name="vcolor" :value="color"></editor-text>
        <editor-select label="Block" name="vblock" :value="block">
            <option value="">Normal</option>
            <option value="d-inline">Inline</option>
            <option value="d-inline-block">Inline Block</option>
            <option value="d-block">Block</option>
        </editor-select>
        <editor-select label="Display" name="vdisplay" :value="display">
            <option value="">Normal</option>
            <option value="display-1">Display-1</option>
            <option value="display-2">Display-2</option>
            <option value="display-3">Display-3</option>
            <option value="display-4">Display-4</option>
        </editor-select>
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