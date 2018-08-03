import util from 'ffd-util';

export default {
    text(vnode) {
        let children = vnode.children || vnode.default;
        if (children) {
            let text = [];
            for (let i = 0, len = children.length; i < len; i++) {
                text.push(children[i].text);
            }
            text = text.join('');
            let space = text.match(/^ +/m);
            if (space) {
                text = text.replace(new RegExp('\n' + space[0], 'g'), '\n');
            }
            return text.trim();
        }
    },
    attr(vnode, name) {
        let data = vnode.data;
        return data && data.attrs ? data.attrs[name] : null;
    },
    random() {
        return ('' + Math.random()).replace('.', '');
    },
    data(vm, prefix, data) {
        if (!vm) return {};
        data = data || {};
        let $data = vm.$data;
        if (prefix) {
            let names = Object.getOwnPropertyNames($data);
            prefix = util.isString(prefix) ? prefix : '';
            for (let i = 0, len = names.length; i < len; i++) {
                let name = names[i];
                if (name.charAt(0) === 'v') {
                    data[prefix + name.substr(1)] = $data[name];
                }
            }
        } else {
            let names = vm.$options._propKeys;
            if (names) {
                for (let k = 0, klen = names.length; k < klen; k++) {
                    let name = names[k],
                        vname = 'v' + name;
                    data[name] = $data[vname];
                }
            }
        }
        return data;
    },
    children(vm) {
        let $children = vm.$children;
        if ($children) {
            $children.sort(sortVueChildren);
        } else {
            $children = [];
        }
        return $children;
    },
    save(vm, html, space) {
        html = html || [];
        space = space || '';
        let tag = vm.$options.name || 'div',
            $data = this.data(vm),
            cspace = (space || '\n') + '    ';
        html.push(space, '<', tag);
        for (let name in $data) {
            if ($data[name]) {
                html.push(' ', name, '="', $data[name], '"');
            }
        }
        html.push('>');
        let htmlLen = html.length;
        if (vm.$options.save) {
            vm.$options.save(vm, html, cspace);
        } else {
            let $children = this.children(vm);
            for (let i = 0, len = $children.length; i < len; i++) {
                this.save($children[i], html, cspace);
            }
        }
        if (htmlLen < html.length) {
            html.push(space || '\n');
        }
        html.push('</', tag, '>');
        return html;
    }
}

function sortVueChildren(va, vb) {
    return va.$el.compareDocumentPosition(vb.$el) === 2 ? 1 : -1;
}