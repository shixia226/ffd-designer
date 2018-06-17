import VTool from '../common/v-tool';

Vue.component('widget-collapse', {
    template: `<div :id="pid">
            <div class="card" v-for="(item, index) in vitems" :key="item.id">
                <div class="card-header">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" :data-target="'#'+item.id">{{item.header}}</button>
                    </h5>
                </div>

                <div :id="item.id" :class="['collapse', {show:item.show}]" :data-parent="'#'+pid">
                    <div class="card-body">
                        <slot :name="item.id"></slot>
                    </div>
                </div>
            </div>
        </div>`,
    editor: `<widget-collapse>
            <div v-for="(item, index) in items" :key="item.id">
                <editor-text :name="'vitems.' + index + '.header'" :value="item.header"></editor-text>
                <editor-button text="Remove" :handler="'this.vitems.splice(' + index + ', 1)'"></editor-button>
            </div>
        </widget-collapse>
        <hr class="my-4">
        <editor-button text="Add" handler="this.$options.add(this)"></editor-button>`,
    add(vm) {
        vm.vitems.push({ id: VTool.random(), header: 'New Item' });
    },
    created() {
        let _render = this._render;
        this._render = function() {// 这里复写_render方法，防止update内容后$slots重新生成，无法对应到各个slot
            let $slots = this.$slots;
            for (let name in $slots) {
                if (name !== 'default') {
                    return _render.apply(this, arguments); //之前有对应关系，直接继续调用
                }
            }
            // 重写对应关系
            let children = this.$slots.default, items = [];
            for (let i = 0, len = children.length; i < len; i++) {
                let node = children[i];
                if (node.tag) {
                    let id = VTool.random();
                    this.$slots[id] = node;
                    items.push({
                        id: id,
                        header: VTool.attr(node, 'header') || ('Item ' + items.length),
                    })
                }
            }
            setItemShow(items, this);
            this.vitems = items;
            return _render.apply(this, arguments);
        }
    },
    data() {
        let children = this.$slots.default, items = [];
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            if (node.tag) {
                let id = VTool.random();
                this.$slots[id] = node;
                items.push({
                    id: id,
                    header: VTool.attr(node, 'header') || ('Item ' + items.length),
                })
            }
        }
        setItemShow(items, this);
        return {
            pid: VTool.random(),
            vitems: items
        }
    }
})

function setItemShow(items, vm) {
    let idx = 0;
    if (vm.$el) {
        let elems = vm.$el.querySelectorAll('.card > .collapse');
        for (let i = 0, len = elems.length; i < len; i++) {
            if (elems[i].className.indexOf('show') !== -1) {
                idx = i;
                break;
            }
        }
    }
    items[idx].show = true;
}