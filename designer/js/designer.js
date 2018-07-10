import VTool from '../../common/v-tool';
import Page from './page';
import Nav from './nav';
import Ppt from './ppt';
import Selector from './selector';

let rootVm, selectVm, pptVm;

export default {
    init(page) {
        Nav(this, '.designer > .nav');
        Selector.init(this, $('.designer > .editor')[0]);
        this.render(page);
    },
    render(page) {
        Selector.select();
        if (page) {
            $.ajax({
                url: './pages/' + page + '.html',
                success: initPage
            });
        } else {
            initPage('');
        }
    },
    save() {
        let content = this.html();
        console.log(content);
    },
    select(vm) {
        vm = vm || rootVm;
        if (vm) {
            Selector.select(arguments[1] || [vm.$el], vm.$options.resizable);
            pptVm = Ppt(selectVm = vm, '.ppt');
        }
    },
    adjust() {
        if (selectVm) {
            pptVm = Ppt(selectVm, '.ppt');
            rootVm.$nextTick(function() {
                Selector.select(true);
            })
        }
    },
    remove(vm) {
        vm = vm || selectVm;
        if (vm && selectVm !== rootVm) {
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
    browseVm(rootVm);
}
function browseVm(vm) {
    let $children = vm.$children;
    for (let i = 0, len = $children.length; i < len; i++) {
        let vm = $children[i];
        vm.$options.updated = LISTENER_UPDATED;
        browseVm(vm);
    }
}
const LISTENER_UPDATED = [function () {
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