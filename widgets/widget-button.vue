Vue.component('widget-button', {
    template: `<button type="button" :class="['btn', 'btn-' + vtheme, vsize ? 'btn-' + vsize : '', vblock ? 'btn-block' : '']">{{vtext}}</button>`,
    props: ['theme', 'size', 'block', 'text'],
    editor: `<editor-theme :value="theme" outline="true"></editor-theme>
        <editor-size :value="size"></editor-size>
        <editor-switch name="vblock" :value="block" label="Block"></editor-switch>
        <editor-text name="vtext" :value="text" label="Text"></editor-text>`,
    data(){
        return {
            vtheme: this.theme || 'primary',
            vsize: this.size || '',
            vblock: this.block,
            vtext: this.text || 'Button'
        }
    }
});