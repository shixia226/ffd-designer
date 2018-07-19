import util from 'ffd-util';

export default function(step) {
    const undoQueue = [],
        redoQueue = [];

    let lock = false;
    step = parseInt(step);
    if (isNaN(step) || step < 1) step = 10;

    return {
        undo() {
            let act = undoQueue.pop();
            if (act) {
                lock = true;
                redoQueue.push(act);
                util.call(act.undo);
                lock = false;
            } else {
                return false;
            }
        },
        redo() {
            let act = redoQueue.pop();
            if (act) {
                lock = true;
                undoQueue.push(act);
                util.call(act.redo);
                lock = false;
            } else {
                return false;
            }
        },
        action(act) {
            if (!lock && act) {
                undoQueue.push(act);
                if (undoQueue.length > step) {
                    undoQueue.shift();
                } else {
                    redoQueue.length = 0;
                }
            }
        }
    }
}