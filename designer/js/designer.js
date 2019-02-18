import VTool from '../../common/v-tool';
import Page from './page';
import Nav from './nav';
import Ppt from './ppt';
import Selector from './selector';
import Clipboard from '../../common/clipboard';
import UndoRedo from '../../common/undo-redo';
import util from 'ffd-util';

let rootVm, activeVm, selectedVm, pptVm, undoRedo;

export default {
    init(page) {
        Selector.init(this, $('.designer > .editor')[0], {
            onchange: onVmDataChange,
            onmove: onVmMove,
            oninsert: onVmInsert
        });
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
                let $pchildren = VTool.children(pvm),
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
        undoRedo.undo();
    },
    redo() {
        undoRedo.redo();
    },
    save() {
        let content = this.html();
        console.log(content);
    },
    regist(vm) {
        vm.$el.setAttribute('widget-container', true);
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
        pptVm = Ppt(activeVm = vm, vm.$el.getAttribute('designer') === 'group', '.ppt', onVmDataChange);
    },
    upselect() {
        if (activeVm && activeVm !== rootVm) {
            this.select(activeVm.$parent);
        }
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
            let pvm = vm.$parent,
                pidx = getVmIndex(pvm),
                idx = VTool.children(pvm).indexOf(vm);
            undoRedo.action({
                undo: {
                    handler: undoRemove,
                    context: this,
                    args: [pidx, idx, this.html(vm)]
                },
                redo: {
                    handler: redoRemove,
                    context: this,
                    args: [pidx, idx]
                }
            })
            removeVm.call(this, vm);
        }
    },
    html(vm) {
        vm = vm || rootVm
        return vm ? VTool.save(vm).join('') : '';
    },
    getVm(elem, type) {
        if (rootVm) {
            let pelems = [],
                $root = rootVm.$el;
            while (elem && elem !== $root) {
                pelems.push(elem);
                elem = elem.parentNode;
                if (!elem || elem.nodeType === 9) {
                    pelems.length = 0;
                    break;
                }
            }
            if (type !== true) {
                for (let i = pelems.length - 1; i >= 0; i--) {
                    let elem = pelems[i],
                        designer = elem.getAttribute('designer');
                    if (designer === 'group') {
                        pelems = pelems.slice(type === 'drop' ? i + 1 : i);
                        break;
                    }
                }
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
    undoRedo = new UndoRedo();
}
const LISTENER_UPDATED = [function() {
    this.$root.$emit('updated');
}];

function onVmDataChange(vm, nv, ov) {
    let idx = getVmIndex(vm);
    undoRedo.action({
        undo: {
            handler: setVmData,
            args: [idx, ov]
        },
        redo: {
            handler: setVmData,
            args: [idx, nv]
        }
    })
}

function getNextVmIndex(pvm, elem) {
    while (true) {
        elem = elem.nextSibling;
        if (!elem || elem.nodeType === 1) break;
    }
    return elem ? VTool.children(pvm).indexOf(this.getVm(elem)) : -1;
}

function onVmMove(elems, helper) {
    let len = elems.length,
        npvm = this.getVm(helper.parentNode),
        lastElem;
    for (let i = 0; i < len; i++) {
        let elem = elems[i];
        if (!lastElem) {
            lastElem = elem;
        } else if (lastElem.compareDocumentPosition(elem) !== 2) {
            lastElem = elem;
        }
    }
    let opvm = this.getVm(lastElem.parentNode),
        opidx = getVmIndex(opvm),
        onidx = getNextVmIndex.call(this, opvm, lastElem) - len,
        npidx = getVmIndex(npvm),
        nnidx = getNextVmIndex.call(this, npvm, helper);
    undoRedo.action({
        undo: {
            handler: moveVm,
            context: this,
            args: [opidx, onidx, npidx, nnidx, len]
        },
        redo: {
            handler: moveVm,
            context: this,
            args: [npidx, nnidx, opidx, onidx, len]
        }
    })
}

function moveVm(npidx, nnidx, opidx, onidx, len) {
    let npvm = getVmByIndex(npidx),
        $nchildren = VTool.children(npvm),
        opvm = getVmByIndex(opidx),
        $ochildren = VTool.children(opvm),
        pelem, func, next;
    if (nnidx < 0) {
        nnidx = $nchildren.length - 1;
        func = 'appendChild';
        pelem = npvm.droppable();
    } else {
        func = 'insertBefore';
        next = $nchildren[nnidx].$el;
        pelem = next.parentNode;
    }
    if (onidx < 0) {
        onidx = $ochildren.length - len;
    }
    for (let i = onidx + len - 1; i >= onidx; i--) {
        let vm = $ochildren[i];
        pelem[func](vm.$el, next);
        $nchildren.splice(nnidx, 0, vm);
        vm.$parent = npvm;
    }
    this.select();
}

function onVmInsert(widget, helper) {
    let pvm = this.getVm(helper.parentNode),
        pidx = getVmIndex(pvm),
        nidx = getNextVmIndex.call(this, pvm, helper);
    undoRedo.action({
        undo: {
            handler: undoVmInsert,
            context: this,
            args: [pidx, nidx]
        },
        redo: {
            handler: redoVmInsert,
            context: this,
            args: [pidx, nidx, widget]
        }
    })
}

function undoVmInsert(pidx, nidx) {
    let pvm = getVmByIndex(pidx),
        $children = VTool.children(pvm);
    nidx = nidx < 0 ? $children.length - 1 : nidx;
    removeVm.call(this, $children[nidx]);
}

function redoVmInsert(pidx, nidx, widget) {
    let vm = (new(Vue.component(widget))()).$mount(),
        pvm = getVmByIndex(pidx),
        $children = VTool.children(pvm);
    if (nidx < 0) {
        pvm.droppable().appendChild(vm.$el);
        $children.push(vm);
    } else {
        let el = $children[nidx].$el;
        el.parentNode.insertBefore(vm.$el, el);
        $children.splice(nidx, 0, vm);
    }
    vm.$parent = pvm;
    vm.$root = pvm.$root;
    this.regist(vm);
    this.select(vm);
}

function undoRemove(pidx, idx, content) {
    let elem = document.createElement('div');
    elem.innerHTML = content;
    let nvm = (new Vue({ el: elem })).$children[0];
    let pvm = getVmByIndex(pidx),
        $children = VTool.children(pvm),
        vm = $children[idx];
    if (vm) {
        vm.$el.parentNode.insertBefore(nvm.$el, vm.$el);
        $children.splice(idx, 0, nvm);
    } else {
        pvm.droppable().appendChild(nvm.$el);
        $children.push(nvm);
    }
    nvm.$parent = pvm;
    nvm.$root = pvm.$root;
    this.regist(nvm);
    this.select(nvm);
}

function redoRemove(pidx, idx) {
    removeVm.call(this, VTool.children(getVmByIndex(pidx))[idx]);
}

function removeVm(vm) {
    let $children = vm.$parent.$children;
    $children.splice($children.indexOf(vm), 1);
    vm.$destroy();
    vm.$el.parentNode.removeChild(vm.$el);
    this.select(false);
}

function getVmIndex(vm) {
    let idx = [];
    while (vm !== rootVm) {
        let pvm = vm.$parent;
        idx.unshift(VTool.children(pvm).indexOf(vm));
        vm = pvm;
    }
    return idx;
}

function getVmByIndex(idx) {
    let vm = rootVm;
    for (let i = 0, len = idx.length; i < len; i++) {
        vm = VTool.children(vm)[idx[i]];
    }
    return vm;
}

function setVmData(idx, data) {
    let vm = getVmByIndex(idx);
    for (let name in data) {
        vm[name] = data[name];
    }
}

function getVueCmpByPelem(vm, pelems) {
    let $children = VTool.children(vm);
    for (let i = 0, len = $children.length; i < len; i++) {
        let vcmp = $children[i],
            $el = vcmp.$el,
            idx = pelems.indexOf($el);
        if (idx !== -1) {
            pelems.length = idx;
            return getVueCmpByPelem(vcmp, pelems);
        }
    }
    return vm;
}