export default {
    text(vnode) {
        let children = vnode.children;
        if (children) {
            let text = [];
            for (let i = 0, len = children.length; i < len; i++) {
                text.push(children[i].text);
            }
            return text.join('');
        }
    },
    attr(vnode, name) {
        let data = vnode.data;
        return data && data.attrs ? data.attrs[name] : null;
    },
    random() {
        return ('' + Math.random()).replace('.', '');
    }
}