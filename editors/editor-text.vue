Vue.component('editor-text', {
    template: `<div class="form-group">
            <label>{{label}}</label>
            <textarea class="form-control" :placeholder="placeholder" v-model="vvalue" @change="$root.$emit('changeppt', name, vvalue)" :style="{height: multi+'px'}" v-if="multi"></textarea>
            <input class="form-control" :placeholder="placeholder" v-model="vvalue" @change="$root.$emit('changeppt', name, vvalue)" v-else>
            <small class="form-text text-muted">{{helper}}</small>
        </div>`,
    props: ['name', 'value', 'label', 'placeholder', 'helper', 'multi'],
    data() {
        return {
            vvalue: this.value
        }
    }      
})