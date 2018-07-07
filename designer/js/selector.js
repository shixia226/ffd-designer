import Selector from 'ffd-selector';
import { Timeout } from 'ffd-util';

export default {
    init(dsVm, el) {
        Selector.config({
            owner: el,
            onselect(evt, elems) {
                if (elems) {
                    let pptCmp, vms = [];
                    for (let i = 0, len = elems.length; i < len; i++) {
                        let vm = getVueCmp(dsVm, elems[i]);
                        if (vm) {
                            if (!pptCmp) pptCmp = vm;
                            if (vms.indexOf(vm = vm.$el) === -1) {
                                vms.push(vm);
                            }
                        }
                    }
                    if (pptCmp) {
                        Selector.select(vms, pptCmp.$options.resizable);
                    }
                    dsVm.pptCmp = pptCmp;
                } else {
                    let vm = getVueCmp(dsVm, evt.target);
                    if (vm) {
                        Selector.select([vm.$el], vm.$options.resizable);
                    }
                    dsVm.pptCmp = vm;
                }
            },
            ondragover(target, over) {
                let vm = getVueCmp(dsVm, target),
                    dropelem;
                while (vm && (!vm.droppable || !(dropelem = vm.droppable()))) {
                    if (vm === dsVm) break;
                    vm = getVueCmp(dsVm, vm.$el.parentNode);
                }
                if (vm) {
                    let helper = over && over.helper;
                    if (over && over.vm === vm) {
                        over.dropelem = dropelem;
                    } else {
                        if (!helper) {
                            helper = document.createElement('div');
                            helper.className = 'drop-helper';
                        }
                        over = { vm: vm, dropelem: dropelem, helper: helper };
                        $(vm.$el).addClass('droppable');
                    }
                    Timeout.remove(over.timer);
                    while (target) {
                        let pelem = target.parentNode;
                        if (pelem === dropelem) {
                            break;
                        }
                        target = pelem;
                    }
                    if (target) {
                        if (target !== helper) {
                            dropelem.insertBefore(helper, target);
                        }
                    } else if (helper.parentNode) {
                        over.timer = Timeout.add({
                            handler: dropelem.appendChild,
                            context: dropelem,
                            args: [helper],
                            unique: true
                        });
                    } else {
                        dropelem.appendChild(helper);
                    }
                    return over;
                }
            },
            ondraghover(target, over) {
                let vm = over.vm;
                if (vm.hover) {
                    vm.hover(target);
                    let dropelem = vm.droppable();
                    if (dropelem !== over.dropelem) {
                        dropelem.appendChild(over.helper);
                        over.dropelem = dropelem;
                    }
                }
            },
            ondragstart(target) {
                let $elem = $(target);
                if (!$elem.attr('widget')) {
                    $elem = $elem.closest('[widget]');
                }
                if ($elem.length) {
                    let helper = document.body.appendChild($elem[0].cloneNode(true));
                    helper.className = 'draggable';
                    return {
                        helper: helper,
                        cursorAt: {
                            x: -helper.offsetWidth / 2,
                            y: -helper.offsetHeight / 2
                        },
                        widget: $elem.attr('widget')
                    }
                }
            },
            ondragout(over) {
                Timeout.remove(over.timer);
                $(over.vm.$el).removeClass('droppable');
            },
            ondrop(over, start) {
                let elems = start.elems,
                    dropelem = over.dropelem,
                    helper = over.helper,
                    pvm = over.vm;
                if (elems) {
                    for (let i = 0, len = elems.length; i < len; i++) {
                        let vm = getVueCmp(dsVm, elems[i]);
                        dropelem.insertBefore(vm.$el, helper);
                        pvm.$children.push(vm);
                        vm.$parent = pvm;
                    }
                    elems[0].scrollIntoView(true);
                    Selector.select(true);
                } else {
                    let Widget = Vue.component(start.widget);
                    if (Widget) {
                        let vm = (new Widget()).$mount();
                        dropelem.insertBefore(vm.$el, helper);
                        vm.$parent = pvm;
                        vm.$root = pvm.$root;
                        dsVm.pptCmp = vm;
                        vm.$el.scrollIntoView(true);
                        Selector.select([vm.$el], vm.$options.resizable);
                    }
                }
                helper.parentNode.removeChild(helper);
            },
            onresize(elems, rw, rh) {
                for (let i = 0, len = elems.length; i < len; i++) {
                    let elem = elems[i],
                        vm = getVueCmp(dsVm, elem);
                    if (vm && vm.resize) {
                        vm.resize(parseInt(rw * elem.clientWidth), parseInt(rh * elem.clientHeight));
                        dsVm.refreshPpt();
                    }
                }
                dsVm.$nextTick(function() {
                    Selector.select(true);
                })
                return false;
            }
        });

        $('body').on('mousemove', function(evt) {
            Selector.mousemove(evt);
        }).on('mouseup mouseleave', function(evt) {
            Selector.mouseup(evt);
        });
    },
    mousedown(evt) {
        Selector.mousedown(evt);
    },
    dragstart(evt) {
        Selector.dragstart(evt);
        evt.preventDefault();
    },
    select(elems, resizable) {
        Selector.select(elems, resizable);
    }
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
    while (elem && elem !== $root) {
        pelems.push(elem);
        elem = elem.parentNode;
    }
    return getVueCmpByPelem(vm, pelems);
}