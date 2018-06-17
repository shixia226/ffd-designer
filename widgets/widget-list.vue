import VTool from '../common/v-tool';

Vue.component('widget-list', {
    template: `<ul class="list-group">
            <li v-for="(item, index) in vitems" class="list-group-item" :key="item.id">
                <slot :name="item.id"></slot>
            </li>
        </ul>`,
    editor: `<div v-for="(item, index) in items" class="mb-3"><editor-button :handler="'this.vitems.splice('+index+', 1)'" :text="'Remote Item '+index" :key="item.id"></editor-button></div>
        <hr class="my-4">
        <editor-button handler="this.$options.add(this)" text="Add"></editor-button>`,
    add(vm) {
        vm.vitems.push({
            id: VTool.random()
        })
    },
    data(){
        let children = this.$slots.default, items = [];
        for (var i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            if (node.tag) {
                let id = VTool.random();
                this.$slots[id] = node;
                items.push({
                    id: id
                })
            }
        }
        return {
            vitems: items
        }
    }
})