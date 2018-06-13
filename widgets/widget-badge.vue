Vue.component('widget-badge', {
    template: `<span :class="['badge', 'badge-' + vtheme, vpill ? 'badge-pill' : '']">{{vtext}}</span>`,
    props: ['theme', 'pill', 'size', 'text'],
    editor: `<editor-theme :value="theme"></editor-theme>
        <editor-switch name="vpill" :value="pill" label="Pill"></editor-switch>
        <editor-text name="vtext" :value="text"></editor-text>`,
    data() {
        return {
            vtheme: this.theme || 'secondary',
            vpill: this.pill,
            vtext: this.text || 'Badge'
        }
    }
});