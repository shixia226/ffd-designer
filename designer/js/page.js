import Selector from './selector';

export default function(el, events) {
    return new Vue({
        el: el,
        replace: false,
        methods: {
            mousedown(evt) {
                Selector.mousedown(evt);
            },
            droppable() {
                return this.$el;
            }
        },
        save(vm, html, space) {
            html.push(space, '<textarea style="display:none">', JSON.stringify({
                title: vm.vtitle,
                script: vm.vscript
            }), '</textarea>');
            return false;
        },
        editor: `<editor-text name="vtitle" :value="title" label="Title"></editor-text>
            <editor-text name="vscript" :value="script" label="Script" multi="260"></editor-text>`,
        mounted() {
            if (events) {
                for (let name in events) {
                    this.$on(name, events[name]);
                }
            }
        },
        data() {
            let area = $(el).children('textarea').remove().val();
            area = area ? JSON.parse(area) : {};
            return {
                vtitle: area.title || '',
                vscript: area.script || ''
            }
        }
    });
}