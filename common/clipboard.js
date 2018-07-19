export default {
    copy(text) {
        let area = initArea();
        area.value = text || '';
        area.select();
        document.execCommand('copy');
    },
    paste() {
        let area = initArea();
        area.select();
        document.execCommand('paste');
        return area.value;
    }
}

let cyptarea;

function initArea() {
    if (!cyptarea) {
        cyptarea = document.body.appendChild(document.createElement('textarea'));
        cyptarea.style.cssText = '; position: absolute; width: 0; height: 0; left: -999px; top: -999px;';
    }
    return cyptarea;
}