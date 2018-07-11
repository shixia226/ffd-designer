import VTool from '../../common/v-tool';
import Page from './page';
import Nav from './nav';
import Ppt from './ppt';
import Selector from './selector';
import Clipboard from './clipboard';
import util from 'ffd-util';

let rootVm, activeVm, selectedVm, pptVm;

export default {
    init(page) {
        Selector.init(this, $('.designer > .editor')[0]);
        Nav(this, '.designer > .nav').render(page);
    },
    render(page) {
        Selector.select();
        if (page) {
            $.ajax({
                url: './pages/' + page + '.html',
                context: this,
                success: initPage
            });
        } else {
            initPage.call(this, '');
        }
    },
    copy() {
        if (selectedVm) {
            let html = [];
            for (let i = 0, len = selectedVm.length; i < len; i++) {
                html.push(this.html(selectedVm[i]));
            }
            Clipboard.copy(html.join(''));
        }
    },
    paste() {
        let pvm = activeVm,
            dropelem;
        while (pvm && (!pvm.droppable || !(dropelem = pvm.droppable()))) {
            pvm = this.getVm(pvm.$el.parentNode);
        }
        if (pvm) {
            let elem = document.createElement('div');
            elem.innerHTML = Clipboard.paste();
            let $children = new Vue({ el: elem }).$children;
            if ($children) {
                let $pchildren = pvm.$children,
                    $root = pvm.$root,
                    elems = [];
                for (let i = 0, len = $children.length; i < len; i++) {
                    let vm = $children[i],
                        $el = vm.$el;
                    dropelem.appendChild($el);
                    $pchildren.push(vm);
                    vm.$parent = pvm;
                    vm.$root = $root;
                    this.regist(vm);
                    elems.push($el);
                }
                this.select($children[0], elems);
            }
        }
    },
    undo() {

    },
    redo() {

    },
    save() {
        let content = this.html();
        console.log(content);
    },
    regist(vm) {
        vm.$options.updated = LISTENER_UPDATED;
        let $children = vm.$children;
        for (let i = 0, len = $children.length; i < len; i++) {
            this.regist($children[i]);
        }
    },
    select(vm) {
        if (util.isArray(vm)) {
            selectedVm = vm;
            vm = vm[0];
        } else {
            vm = vm || rootVm;
            selectedVm = [vm];
        }
        Selector.select(arguments[1] || [vm.$el], vm.$options.resizable);
        pptVm = Ppt(activeVm = vm, '.ppt');
    },
    adjust() {
        if (activeVm) {
            pptVm = Ppt(activeVm, '.ppt');
            rootVm.$nextTick(function() {
                Selector.select(true);
            })
        }
    },
    remove(vm) {
        vm = vm || activeVm;
        if (vm && activeVm !== rootVm) {
            vm.$destroy();
            vm.$el.parentNode.removeChild(vm.$el);
            this.select();
        }
    },
    html(vm) {
        vm = vm || rootVm
        return vm ? VTool.save(vm).join('') : '';
    },
    getVm(elem) {
        if (rootVm) {
            let pelems = [],
                $root = rootVm.$el;
            while (elem && elem !== $root) {
                pelems.push(elem);
                elem = elem.parentNode;
            }
            return getVueCmpByPelem(rootVm, pelems);
        }
    }
}

function initPage(content) {
    $('.designer > .editor > .content').html(content);
    rootVm = Page('.designer > .editor > .content', {
        collapse: function(index) {
            if (pptVm) {
                let children = pptVm.$children;
                for (let i = 0, len = children.length; i < len; i++) {
                    let cmp = children[i];
                    if (cmp.active) {
                        cmp.active(index);
                    }
                }
            }
        },
        updated: function() {
            this.$nextTick(function() {
                Selector.select(true);
            })
        }
    });
    this.regist(rootVm);
}
const LISTENER_UPDATED = [function() {
    this.$root.$emit('updated')
}];

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