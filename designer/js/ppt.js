import VTool from '../../common/v-tool';
import util from 'ffd-util';

export default function(vcmp, group, el, onchange) {
    let editor = vcmp.$options.editor || '',
        data = VTool.data(vcmp, true),
        ivcmps;
    if (group) {
        editor = [editor];
        formatVmGroupPpt(vcmp, data, editor, ivcmps = {}, 1);
        editor = editor.join('');
    }
    return new Vue({
        el: el,
        template: '<div class="ppt">' + editor + '</div>',
        data() {
            return data;
        },
        created() {
            this.$on('changeppt', function(name, value) {
                let iname = name.match(/^(virppt__\d+_)(.+)$/),
                    cmp;
                if (iname) {
                    cmp = ivcmps[iname[1]];
                    name = iname[2];
                } else {
                    cmp = vcmp;
                }
                let names = name.split('.'),
                    data = cmp,
                    len = names.length - 1;
                for (let i = 0; i < len; i++) {
                    data = data[names[i]];
                }
                let dataName = names[len];
                util.call(onchange, null, cmp, {
                    [dataName]: value
                }, {
                    [dataName]: data[dataName]
                });
                data[dataName] = value;
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

function formatVmGroupPpt(vcmp, data, editor, ivcmps, idx) {
    let $children = vcmp.$children;
    for (let i = 0, len = $children.length; i < len; i++) {
        let key = 'virppt__' + idx + '_',
            cmp = $children[i];
        ivcmps[key] = cmp;
        VTool.data(cmp, key, data);
        editor.push((cmp.$options.editor || '').replace(/(name|:value)="([^"]+)"/g, '$1="' + key + '$2"'));
        idx = formatVmGroupPpt(cmp, data, editor, ivcmps, idx + 1);
    }
    return idx + 1;
}