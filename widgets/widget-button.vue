Vue.component('widget-button', {
    template: `<button type="button" :class="['btn', 'btn-' + vtheme, vsize ? 'btn-' + vsize : '', vblock ? 'btn-block' : '', vclazz]">{{vtext}}</button>`,
    props: ['theme', 'size', 'clazz', 'block', 'text'],
    editor: `<editor-theme :value="theme" outline="true"></editor-theme>
        <editor-size :value="size"></editor-size>
        <editor-text label="Clazz" name="vclazz" :value="clazz"></editor-text>
        <editor-switch name="vblock" :value="block" label="Block"></editor-switch>
        <editor-text name="vtext" :value="text" label="Text"></editor-text>`,
    data(){
        return {
            vtheme: this.theme || 'primary',
            vsize: this.size || '',
            vclazz: this.clazz || '',
            vblock: this.block,
            vtext: this.text || 'Button'
        }
    }
});