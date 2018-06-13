Vue.component('editor-button', {
    template: `<button type="button" :class="['btn', 'btn-secondary', 'btn-sm']" @click="$root.$emit('click', handler)">{{text}}</button>`,
    props: ['text', 'handler']
})