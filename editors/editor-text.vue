Vue.component('editor-text', {
    template: `<div class="form-group">
            <label>{{label}}</label>
            <input class="form-control" aria-describedby="emailHelp" :placeholder="placeholder" v-model="vvalue" @change="$root.$emit('changeppt', name, vvalue)">
            <small id="emailHelp" class="form-text text-muted">{{helper}}</small>
        </div>`,
    props: ['name', 'value', 'label', 'placeholder', 'helper'],
    data() {
        return {
            vvalue: this.value
        }
    }      
})