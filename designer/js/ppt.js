import VTool from '../../common/v-tool';
import util from 'ffd-util';

export default function(vcmp, el, onchange) {
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
                    let dataName = names[len];
                    util.call(onchange, null, vcmp, {
                        [dataName]: value
                    }, {
                        [dataName]: data[dataName]
                    });
                    data[dataName] = value;
                }
            })
            this.$on('click', function(handler) {
                try {
                    util.call(onchange, null, vcmp);
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