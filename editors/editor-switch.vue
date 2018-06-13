Vue.component('editor-switch', {
    template: `<div class="form-check">
            <label class="form-check-label"><input type="checkbox" class="form-check-input" :checked="vvalue" @change="$root.$emit('changeppt', name, vvalue)" v-model="vvalue">{{label}}</label>
        </div>`,
    props: ['name', 'value', 'label'],
    data() {
        return {
            vvalue: this.value
        }
    }
})