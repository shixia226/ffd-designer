import VTool from '../common/v-tool';

Vue.component('widget-text', {
    template: `<span>{{vtext}}</span>`,
    editor: `<editor-text name="vtext" :value="text"></editor-text>`,
    save(vm, space) {
        return space + vm.vtext
    },
    data() {
        return {
            vtext: VTool.text(this.$slots) || 'Text'
        }
    }
})