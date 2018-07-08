import VTool from '../common/v-tool';

Vue.component('widget-collapse', {
    template: `<div :id="pid">
            <div :class="['card', cardClass||'']" v-for="(item, index) in vitems" :key="item.id" :data-item="index">
                <div class="card-header">
                    <h5 class="mb-0">
                        <button class="btn btn-link p-0" data-toggle="collapse" :data-target="'#'+item.id" @click="active(index)">{{item.header}}</button>
                    </h5>
                </div>

                <div :id="item.id" :class="['collapse', {show:item.show}]" :data-parent="'#'+pid">
                    <div :class="['card-body', bodyClass||'']">
                        <slot :name="item.id"></slot>
                    </div>
                </div>
            </div>
        </div>`,
    props: ['cardClass', 'bodyClass'],
    editor: `<widget-collapse>
            <div v-for="(item, index) in items" :key="item.id">
                <editor-text :name="'vitems.' + index + '.header'" :value="item.header"></editor-text>
                <editor-button text="Remove" :handler="'this.vitems.splice(' + index + ', 1)'"></editor-button>
            </div>
        </widget-collapse>
        <hr class="my-4">
        <editor-button text="Add" handler="this.$options.add(this)"></editor-button>`,
    add(vm) {
        let items = vm.vitems, id = VTool.random();
        vm.$slots[id] = vm._c('div');
        items.push({ id: id, header: 'New Item', show: false });
        vm.active(items.length - 1);
    },
    save(vm, html, space) {
        html = html || [];
        let $slots = vm.$slots,
            items = vm.vitems,
            cspace = space + '    ',
            $children = VTool.children(vm),
            idxs = [];
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i], pelem = $slots[item.id].elm;
            html.push(space, '<div header="', item.header, '">');
            for (let k = 0, klen = $children.length; k < klen; k++) {
                let vcmp = $children[k];
                if (!idxs[k] && pelem.contains(vcmp.$el)) {
                    VTool.save(vcmp, html, cspace);
                }
            }
            html.push(space, '</div>');
        }
        return html;
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
            if (children) {
                for (let i = 0, len = children.length; i < len; i++) {
                    let node = children[i];
                    if (node.tag) {
                        let id = VTool.random();
                        this.$slots[id] = node;
                        items.push({
                            id: id,
                            show: false,
                            header: VTool.attr(node, 'header') || ('Item ' + items.length),
                        })
                    }
                }
                setItemShow(items, this);
            }
            this.vitems = items;
            return _render.apply(this, arguments);
        }
    },
    data() {
        let children = this.$slots.default, items = [];
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                let node = children[i];
                if (node.tag) {
                    let id = VTool.random();
                    this.$slots[id] = node;
                    items.push({
                        id: id,
                        show: false,
                        header: VTool.attr(node, 'header') || ('Item ' + items.length),
                    })
                }
            }
            setItemShow(items, this);
        }
        return {
            pid: VTool.random(),
            vitems: items
        }
    },
    methods: {
        active(index) {
            if (index === this.activeIdx) return;
            if (!isNaN(this.activeIdx)) {
                this.vitems[this.activeIdx].show = false;
            }
            this.vitems[this.activeIdx = index].show = true;
            this.$nextTick(function() {
                this.$root.$emit('collapse', index);
            })
        },
        hover(target) {
            let index = $(target).closest('[data-item]').attr('data-item');
            if (index) {
                this.active(parseInt(index));
            }
        },
        droppable() {
            if (!isNaN(this.activeIdx)) {
                return this.$slots[this.vitems[this.activeIdx].id].elm;
            }
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
    vm.activeIdx = idx;
}