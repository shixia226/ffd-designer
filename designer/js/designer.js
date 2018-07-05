import Selector from './selector';
import Nav from './nav';
import Ppt from './ppt';

export default function() {
    return new Vue({
        el: '.app',
        replace: false,
        data: {
            pptCmp: undefined
        },
        watch: {
            pptCmp(vcmp) {
                this.pptVue = Ppt(vcmp, '.ppt');
            }
        },
        methods: {
            mousedown(evt) {
                Selector.mousedown(evt);
            },
            add(vm) {
                this.$el.appendChild(vm.$el);
                this.$children.push(vm);
                vm.$parent = this;
            },
            refreshPpt() {
                if (this.pptCmp) {
                    this.pptVue = Ppt(this.pptCmp, '.ppt');
                }
            }
        },
        mounted() {
            this.$on('collapse', function(index) {
                if (this.pptVue) {
                    let children = this.pptVue.$children;
                    for (let i = 0, len = children.length; i < len; i++) {
                        let cmp = children[i];
                        if (cmp.active) {
                            cmp.active(index);
                        }
                    }
                }
            })
            Selector.init(this, $('.app')[0]);
            Nav(this, '.designer-nav > .navbar');
        }
    });
}