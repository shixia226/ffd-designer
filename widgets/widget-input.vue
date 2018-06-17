Vue.component('widget-input', {
    template: `<div :class="['input-group', vsize?'input-group-'+vsize:'']">
            <div class="input-group-prepend" v-if="vprepend">
                <span class="input-group-text">{{vprepend}}</span>
            </div>
            <input type="text" class="form-control" :placeholder="vplaceholder">
            <div class="input-group-append" v-if="vappend">
                <span class="input-group-text">{{vappend}}</span>
            </div>
        </div>`,
    props: ['prepend', 'append', 'placeholder', 'size'],
    editor: `<editor-text name="vplaceholder" :value="placeholder" label="Placeholder"></editor-text>
        <editor-text name="vprepend" :value="prepend" label="Prepend"></editor-text>
        <editor-text name="vappend" :value="append" label="Append"></editor-text>
        <editor-size :value="size"></editor-size>`,
    data() {
        return {
            vprepend: this.prepend,
            vappend: this.append,
            vplaceholder: this.placeholder || '',
            vsize: this.size || ''
        }
    }
})