import VTool from '../../common/v-tool';

export default function(vm, el) {
    new Vue({
        el: el,
        data() {
            return {
                preview: false
            }
        },
        watch: {
            preview() {
                let content = VTool.save(vm).join('');
                document.querySelector('.modal-body').innerHTML = content;
                new Vue({
                    el: '.modal-body',
                    replace: false
                })
            }
        },
        methods: {
            remove() {
                let vcmp = vm.pptCmp;
                if (vcmp) {
                    vcmp.$destroy();
                    vcmp.$el.parentNode.removeChild(vcmp.$el);
                    vm.pptCmp = null;
                }
            }
        }
    })
}