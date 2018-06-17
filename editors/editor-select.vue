import VTool from '../common/v-tool';

Vue.component('editor-select', {
    template: `<div class="form-group">
            <label>{{label}}</label>
            <select class="form-control" @change="$root.$emit('changeppt', name, vvalue)" v-model="vvalue">
                <option v-for="(item, index) in vitems" :value="item.value" :selected="this.vvalue===item.value">{{item.label}}</option>
            </select>
        </div>`,
    props: ['label', 'name', 'value'],
    data() {
        let children = this.$slots.default, items = [];
        for (let i = 0, len = children.length; i < len; i++) {
            let node = children[i];
            if (node.tag) {
                items.push({
                    value: VTool.attr(node, 'value'),
                    label: VTool.text(node)
                })
            }
        }
        return {
            vvalue: this.value,
            vitems: items
        }
    }
})