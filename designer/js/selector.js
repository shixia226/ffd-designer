import Selector from 'ffd-selector';
import util from 'ffd-util';
import { Timeout } from 'ffd-util';

export default {
    init(designer, el, events) {
        Selector.config({
            owner: el,
            onselect(evt, elems) {
                if (elems) {
                    let vms = [],
                        vmelems = [];
                    for (let i = 0, len = elems.length; i < len; i++) {
                        let elem = elems[i],
                            vm = designer.getVm(elem);
                        if (vm && vms.indexOf(vm) === -1) {
                            vms.push(vm);
                            vmelems.push(vm.$el);
                        }
                    }
                    if (vms.length) {
                        designer.select(vms, vmelems);
                    }
                } else {
                    designer.select(designer.getVm(evt.target));
                }
            },
            ondragover(target, over) {
                let vm = designer.getVm(target, 'drop'),
                    dropelem;
                while (vm && (!vm.droppable || !(dropelem = vm.droppable()))) {
                    let pvm = designer.getVm(vm.$el.parentNode, 'drop');
                    if (vm === pvm) break;
                    vm = pvm;
                }
                if (vm) {
                    let helper;
                    if (over && over.vm === vm) {
                        over.dropelem = dropelem;
                        helper = over.helper;
                    } else {
                        helper = document.createElement('div');
                        helper.className = 'drop-helper';
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
                let helper = over.helper;
                if (helper && helper.parentNode) {
                    helper.parentNode.removeChild(helper);
                }
            },
            ondrop(over, start) {
                let elems = start.elems,
                    dropelem = over.dropelem,
                    helper = over.helper,
                    pvm = over.vm;
                if (elems) {
                    util.call(events.onmove, designer, elems, helper);
                    let $children = pvm.$children;
                    for (let i = 0, len = elems.length; i < len; i++) {
                        let vm = designer.getVm(elems[i]);
                        dropelem.insertBefore(vm.$el, helper);
                        let $pchildren = vm.$parent.$children;
                        $pchildren.splice($pchildren.indexOf(vm), 1);
                        if ($children.indexOf(vm) === -1) {
                            $children.push(vm);
                        }
                        vm.$parent = pvm;
                    }
                    elems[0].scrollIntoView(true);
                    Selector.select(true);
                } else {
                    let Widget = Vue.component(start.widget);
                    if (Widget) {
                        util.call(events.oninsert, designer, start.widget, helper);
                        let vm = (new Widget()).$mount();
                        dropelem.insertBefore(vm.$el, helper);
                        pvm.$children.push(vm);
                        vm.$parent = pvm;
                        vm.$root = pvm.$root;
                        designer.regist(vm);
                        designer.select(vm);
                    }
                }
            },
            onresize(elems, rw, rh) {
                for (let i = 0, len = elems.length; i < len; i++) {
                    let elem = elems[i],
                        vm = designer.getVm(elem);
                    if (vm && vm.resize) {
                        let rt = vm.resize(parseInt(rw * elem.clientWidth), parseInt(rh * elem.clientHeight));
                        util.call(events.onchange, designer, vm, rt.nv, rt.ov);
                    }
                }
                designer.adjust();
                return false;
            }
        });

        $(el).on('mousedown', function(evt) {
            Selector.mousedown(evt);
        })
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