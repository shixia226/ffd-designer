import './index.scss';

import './widgets/widget-badge.vue';
import './widgets/widget-button.vue';
import './widgets/widget-breadcrumb.vue';
import './widgets/widget-card.vue';
import './widgets/widget-carousel.vue';
import './widgets/widget-dropdown.vue';
import './widgets/widget-collapse.vue';
import './widgets/widget-input.vue';
import './widgets/widget-list.vue';
import './widgets/widget-container.vue';
import './widgets/widget-text.vue';
import './widgets/widget-pagination.vue';

import './editors/editor-theme.vue';
import './editors/editor-switch.vue';
import './editors/editor-text.vue';
import './editors/editor-size.vue';
import './editors/editor-button.vue';
import './editors/editor-select.vue';

new Vue({
    el: '.app',
    data: {
        pptCmp: undefined
    },
    watch: {
        pptCmp(vcmp) {
            this.pptVue = new Vue({
                el: '.ppt',
                template: '<div class="ppt">' + (vcmp ? vcmp.$options.editor || '' : '') + '</div>',
                data() {
                    return getVueCmpData(vcmp, true);
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
                    this.$on('collapse', function(index, evt) {
                        if (vcmp.active) {
                            vcmp.active(index);
                        }
                    })
                }
            })
        }
    },
    methods: {
        showPpt: function(evt) {
            let elem = evt.target;
            if (!document.querySelector('.ppt').contains(elem)) {
                let vcmp = getVueCmp(this, elem);
                if (vcmp === this.$root) {
                    vcmp = null;
                }
                this.pptCmp = vcmp;
            }
        }
    },
    created() {
        this.$on('collapse', function(index, evt) {
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
        let vm = this;
        new Vue({
            el: '.designer-nav > .navbar',
            data() {
                return {
                    preview: false
                }
            },
            watch: {
                preview(){
                   let content = saveVue(vm).join('');
                   document.querySelector('.modal-body').innerHTML = content;
                   new Vue({
                       el: '.modal-body',
                       replace: false
                   }) 
                }
            }
        })
    }
});

function getVueCmpData(vcmp) {
    if (!vcmp) return {};
    let $data = vcmp.$data,
        data = {};
    if (arguments[1]) {
        let names = Object.getOwnPropertyNames($data);
        for (let i = 0, len = names.length; i < len; i++) {
            let name = names[i];
            if (name.charAt(0) === 'v') {
                data[name.substr(1)] = $data[name];
            }
        }
    } else {
        let names = vcmp.$options._propKeys;
        if (names) {
            for (let k = 0, klen = names.length; k < klen; k++) {
                let name = names[k],
                    vname = 'v' + name;
                data[name] = $data[vname];
            }
        }
    }
    return data;
}


function saveVue(vm, html, space) {
    html = html || [];
    space = space || '';
    let tag = vm.$options.name || 'div',
        $data = getVueCmpData(vm),
        cspace = (space || '\n') + '    ';
    html.push(space, '<', tag);
    for (let name in $data) {
        if ($data[name]) {
            html.push(' ', name, '="', $data[name], '"');
        }
    }
    html.push('>');
    let htmlLen = html.length;
    if (vm.$options.save) {
        html.push(vm.$options.save(vm, cspace, saveVue));
    } else {
        let $children = vm.$children;
        if ($children) {
            for (let i = 0, len = $children.length; i < len; i++) {
                let vcmp = $children[i];
                saveVue(vcmp, html, cspace);
            }
        }
    }
    if (htmlLen < html.length) {
        html.push(space || '\n');
    }
    html.push('</', tag, '>');
    return html;
}

function getVueCmpByPelem(vm, pelems) {
    let $children = vm.$children;
    if ($children) {
        for (let i = 0, len = $children.length; i < len; i++) {
            let vcmp = $children[i],
                $el = vcmp.$el,
                idx = pelems.indexOf($el);
            if (idx !== -1) {
                pelems.length = idx;
                return getVueCmpByPelem(vcmp, pelems);
            }
        }
    }
    return vm;
}

function getVueCmp(vm, elem) {
    let pelems = [],
        $root = vm.$el;
    while (elem !== $root) {
        pelems.push(elem);
        elem = elem.parentNode;
    }
    return getVueCmpByPelem(vm, pelems);
}