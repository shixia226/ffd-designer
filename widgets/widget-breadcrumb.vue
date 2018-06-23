import VTool from '../common/v-tool';

Vue.component('widget-breadcrumb', {
    template: `<nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li v-for="(item, index) in vitems" :key="item.id" :class="['breadcrumb-item', {active: index===vitems.length-1}]"><span v-if="index===vitems.length-1">{{item.text}}</span><a v-else :href="item.link||'#'">{{item.text}}</a></li>
            </ol>
        </nav>`,
    editor: `<widget-collapse>
            <div v-for="(item, index) in items" :key="item.id">
                <editor-text :name="'vitems.' + index + '.text'" :value="item.text" label="Text"></editor-text>
                <editor-text :name="'vitems.' + index + '.link'" :value="item.link" label="Link"></editor-text>
                <editor-button text="Remove" :handler="'this.vitems.splice(' + index + ', 1)'"></editor-button>
            </div>
        </widget-collapse>
        <hr class="my-4">
        <editor-button text="Add" handler="this.$options.add(this)"></editor-button>`,
    save(vm, space = '') {
        let html = [], items = vm.vitems;
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i],
                link = item.link,
                tag;
            html.push(space);
            if (link) {
                html.push('<a href="', link, '" ');
                tag = '</a>';
            } else {
                html.push('<span ');
                tag = '</span>';
            }
            html.push('>', item.text || '', tag);
        }
        return html.join('');
    },
    add(vm) {
        vm.vitems.push({text: 'New Item', link: '', id: VTool.random()});
    },
    data() {
        let items = [], children = this.$slots.default;
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                let item = children[i], text = VTool.text(item);
                if (text) {
                    items.push({
                        id: VTool.random(),
                        link: VTool.attr(item, 'href'),
                        text: text
                    });
                }
            }
        }
        return {
            vitems: items
        }
    }
})