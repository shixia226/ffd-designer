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
        mounted() {
            if (events) {
                for (let name in events) {
                    this.$on(name, events[name]);
                }
            }
        }
    });
}