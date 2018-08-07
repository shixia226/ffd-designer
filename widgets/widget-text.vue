import VTool from '../common/v-tool';

Vue.component('widget-text', {
    template: `<p :class="[vtitle, vclazz]" :style="{color:vcolor, fontSize: vfontsize, lineHeight: vlineheight}">{{vtext}}</p>`,
    props: ['color', 'title', 'clazz', 'fontsize', 'lineheight'],
    editor: `
        <editor-text label="Text" name="vtext" :value="text"></editor-text>
        <editor-text label="Color" name="vcolor" :value="color"></editor-text>
        <editor-select label="Title" name="vtitle" :value="clazz">
            <option value="">Normal</option>
            <option value="h1 d-block my-5">h1</option>
            <option value="h2 d-block my-4">h2</option>
            <option value="h3 d-block my-3">h3</option>
            <option value="h4 d-block my-2">h4</option>
            <option value="h5 d-block my-1">h5</option>
            <option value="h6 d-block">h6</option>
            <option value="alert alert-secondary">quot</option>
        </editor-select>
        <editor-text label="Clazz" name="vclazz" :value="clazz"></editor-text>
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
            vtitle: this.title || '',
            vclazz: this.clazz || '',
            vfontsize: this.fontsize,
            vlineheight: this.lineheight,
            vtext: VTool.text(this.$slots) || 'Text'
        }
    }
})