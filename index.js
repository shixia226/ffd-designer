import './index.scss';
import VTool from './common/v-tool';

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

let widgetVm = new Vue({
    el: '.widgets',
    methods: {
        getWidget() {
            let elem = this.$el.querySelector('.show .active > span');
            if (!elem) {
                return;
            }
            return Vue.component(elem.getAttribute('widget'))
        }
    }
});

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
        let vm = this;
        new Vue({
            el: '.designer-nav > .navbar',
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
                add() {
                    let Widget = widgetVm.getWidget();
                    if (Widget) {
                        let ncmp = (new Widget()).$mount();
                        let vcmp = vm.pptCmp;
                        if (vcmp) {
                            while (vcmp && vcmp !== vm) {
                                if (vcmp.add && vcmp.add(ncmp) !== false) {
                                    ncmp.$parent = vcmp;
                                    ncmp.$root = vcmp.$root;
                                    vm.pptCmp = ncmp;
                                    return;
                                }
                                vcmp = vcmp.$parent;
                            }
                        }
                        vm.$el.appendChild(ncmp.$el);
                        vm.$children.push(ncmp);
                        vm.pptCmp = ncmp;
                        ncmp.$parent = vm;
                        ncmp.$root = vm;
                    }
                },
                remove() {
                    let vcmp = vm.pptCmp;
                    if (vcmp) {
                        vcmp.$destroy();
                        vcmp.$el.parentNode.removeChild(vcmp.$el);
                        vm.pptCmp = null;
                    }
                },
                move() {
                    let vcmp = vm.pptCmp;
                    if (vcmp) {
                        let $el = vcmp.$el,
                            el;
                        if (arguments[0]) {
                            el = getElem($el, 'previousSibling');
                            if (el) {
                                $el.parentNode.insertBefore($el, el);
                            }
                        } else {
                            el = getElem($el, 'nextSibling');
                            if (el) {
                                el = getElem(el, 'nextSibling');
                                if (el) {
                                    $el.parentNode.insertBefore($el, el);
                                } else {
                                    $el.parentNode.appendChild($el);
                                }
                            }
                        }
                    }
                }
            }
        })
    }
});

function getElem(el, name) {
    do {
        el = el[name];
    } while (el && el.nodeType !== 1);
    return el;
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