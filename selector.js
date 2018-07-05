import Selector from 'ffd-selector';
Selector.config({
    onselect(evt, elems) {
        if (elems) {
            if ($(elems[0]).hasClass('drag')) {
                Selector.select(elems, true);
            } else {
                Selector.select($(elems[0]).closest('.drag'), true);
            }
        } else {
            Selector.select($(evt.target).closest('.drag'), true);
        }
    },
    ondragover(target, over) {
        let drag = $(target).closest('.drag');
        if (drag.length) {
            if (over && drag[0] === over[0]) return over;
            drag.addClass('droppable');
            return drag;
        }
    },
    ondragstart(target, evt) {
        let drag = $(target);
        if (drag.hasClass('btn')) {
            return {
                helper: target.cloneNode(true),
                cursorAt: {
                    x: 10,
                    y: 10
                }
            }
        }
    },
    ondragout(over) {
        over.removeClass('droppable');
    },
    ondrop(over, start) {
        over.append($(start.helper).text());
    }
});

$('body').on('mousedown', function(evt) {
    Selector.mousedown(evt);
}).on('mousemove', function(evt) {
    Selector.mousemove(evt);
}).on('mouseup mouseleave', function(evt) {
    Selector.mouseup(evt);
})

$('.btn').on('mousedown', function(evt) {
    Selector.dragstart(evt);
    return false;
})