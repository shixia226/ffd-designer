Vue.component('editor-size', {
    template: `<div class="form-group">
            <label>Size</label>
            <select class="form-control" @change="$root.$emit('changeppt', 'vsize', vvalue)" v-model="vvalue">
                <option v-for="(item, index) in items" :value="item.value" :selected="this.vvalue===item.value">{{item.label}}</option>
            </select>
        </div>`,
    props: ['value'],
    data() {
        return {
            vvalue: this.value,
            items: [{
                value: '',
                label: 'Normal'
            }, {
                value: 'sm',
                label: 'Small'
            }, {
                value: 'lg',
                label: 'Large'
            }]
        }
    }
})