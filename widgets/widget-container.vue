Vue.component('widget-container', {
    template: `<div :class="vclazz"><slot></slot></div>`,
    editor: `<editor-text name="vclazz", :value="clazz" label="Class"></editor-text>`,
    props: ['clazz'],
    data() {
        return {
            vclazz: this.clazz
        }
    }
})