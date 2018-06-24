import VTool from '../common/v-tool';

Vue.component('widget-list', {
    template: `<ul class="list-group">
            <li v-for="(item, index) in vitems" :class="['list-group-item', {active: item.active}]" :key="item.id" @click="active(index)">
                <slot :name="item.id"></slot>
            </li>
        </ul>`,
    editor: `<div v-for="(item, index) in items" class="mb-3">
            <editor-button :handler="'this.vitems.splice('+index+', 1)'" :text="'Remote Item '+index" :key="item.id"></editor-button>
        </div>
        <hr class="my-4">
        <editor-button handler="this.$options.add(this)" text="Add"></editor-button>`,
    props: ['selectable'],
    add(vm) {
        let items = vm.vitems, id = VTool.random();
        vm.$slots[id] = vm._c('div');
        items.push({ id: id, active: false });
        vm.active(items.length - 1);
    },
    data(){
        let children = this.$slots.default, items = [];
        if (children) {
            for (var i = 0, len = children.length; i < len; i++) {
                let node = children[i];
                if (node.tag) {
                    let id = VTool.random();
                    this.$slots[id] = node;
                    items.push({
                        id: id,
                        active: false
                    })
                }
            }
        }
        return {
            vitems: items
        }
    },
    methods: {
        active(index) {
            if (this.selectable !== undefined) {
                let items = this.vitems;
                if (this.selectable !== 'multi' && !isNaN(this.lastAct)) {
                    items[this.lastAct].active = false;
                }
                let item = items[this.lastAct = index];
                item.active = !item.active;
            } else {
                this.lastAct = index;
            }
        },
        add(vm) {
            if (isNaN(this.lastAct)) {
                return false;
            }
            this.$slots[this.vitems[this.lastAct].id].elm.appendChild(vm.$el);
            this.$children.push(vm);
        }
    }
})