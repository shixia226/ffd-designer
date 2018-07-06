import Selector from './selector';

export default function() {
    return new Vue({
        el: '.widgets',
        methods: {
            dragstart(evt) {
                let $elem = $(evt.target);
                if ($elem.attr('widget') || $elem.closest('[widget]').length) {
                    Selector.dragstart(evt);
                }
            },
            getWidget() {
                let elem = this.$el.querySelector('.show .active > span');
                if (!elem) {
                    return;
                }
                return Vue.component(elem.getAttribute('widget'))
            }
        }
    });
}