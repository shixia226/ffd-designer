Vue.component('widget-container', {
    template: `<div :designer="designer" :class="vclazz"><slot></slot></div>`,
    editor: `<editor-text name="vclazz" :value="clazz" label="Class"></editor-text>`,
    props: ['clazz', 'designer'],
    data() {
        return {
            vclazz: this.clazz || '',
            vdesigner: this.designer
        }
    },
    methods: {
        droppable() {
            return this.$el;
        }
    }
})