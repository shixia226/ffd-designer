import VTool from '../../common/v-tool';

export default function(vcmp, el) {
    return new Vue({
        el: el,
        template: '<div class="ppt">' + (vcmp ? vcmp.$options.editor || '' : '') + '</div>',
        data() {
            return VTool.data(vcmp, true);
        },
        created() {
            this.$on('changeppt', function(name, value) {
                if (vcmp) {
                    let names = name.split('.'),
                        data = vcmp,
                        len = names.length - 1;
                    for (let i = 0; i < len; i++) {
                        data = data[names[i]];
                    }
                    data[names[len]] = value;
                }
            })
            this.$on('click', function(handler) {
                try {
                    (new Function(handler)).call(vcmp);
                } catch (e) {
                    console.error('Ppt Handler Register Invalid.');
                }
            })
            this.$on('collapse', function(index) {
                if (vcmp.active) {
                    vcmp.active(index);
                }
            })
        }
    })
}