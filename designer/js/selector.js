import Selector from 'ffd-selector';

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
            ondragover(target) {
                let vm = getVueCmp(dsVm, target);
                while (vm && vm !== dsVm && !vm.add) {
                    vm = getVueCmp(dsVm, vm.$el.parentNode);
                }
                if (vm) {
                    $(vm.$el).addClass('droppable');
                    return vm;
                }
            },
            ondraghover(target, over) {
                if (over.hover) {
                    over.hover(target);
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
                $(over.$el).removeClass('droppable')
            },
            ondrop(over, start) {
                let elems = start.elems;
                if (elems) {
                    for (let i = 0, len = elems.length; i < len; i++) {
                        let vm = getVueCmp(dsVm, elems[i]);
                        if (over.add(vm) !== false) {
                            vm.$parent = over;
                        }
                    }
                    elems[0].scrollIntoView(true);
                    Selector.select(true);
                } else {
                    let Widget = Vue.component(start.widget);
                    if (Widget) {
                        let vm = (new Widget()).$mount();
                        if (over.add(vm) !== false) {
                            vm.$parent = over;
                            vm.$root = over.$root;
                            dsVm.pptCmp = vm;
                            vm.$el.scrollIntoView(true);
                            Selector.select([vm.$el], vm.$options.resizable);
                        }
                    }
                }
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