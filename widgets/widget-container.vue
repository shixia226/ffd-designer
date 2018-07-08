Vue.component('widget-container', {
    template: `<div data-widget="container" :class="vclazz"><slot></slot></div>`,
    editor: `<editor-text name="vclazz" :value="clazz" label="Class"></editor-text>`,
    props: ['clazz'],
    data() {
        return {
            vclazz: this.clazz || 'p-3'
        }
    },
    methods: {
        droppable() {
            return this.$el;
        }
    }
})