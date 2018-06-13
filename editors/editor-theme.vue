Vue.component('editor-theme', {
    template: `<div class="form-group">
            <label>Theme</label>
            <select class="form-control" @change="$root.$emit('changeppt', 'vtheme', vvalue)" v-model="vvalue">
                <option v-for="(item, index) in items" :value="item.value" :selected="this.vvalue===item.value">{{item.label}}</option>
            </select>
        </div>`,
    props: ['value'],
    data() {
        return {
            vvalue: this.value,
            items: getItems()
        };
    }
})

const ITEMS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
function getItems() {
    let items = [];
    for (let i = 0, len = ITEMS.length; i < len; i++) {
        let item = ITEMS[i], label = item.charAt(0).toUpperCase() + item.substr(1);
        items.splice(i, 0, {
            value: item,
            label: label
        });
        items.push({
            value: 'outline-' + item,
            label: 'Outline ' + label
        });
    }
    return items;
}