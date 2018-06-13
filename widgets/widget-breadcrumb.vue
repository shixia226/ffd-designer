import VTool from '../common/v-tool';

Vue.component('widget-breadcrumb', {
    template: `<nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li v-for="(item, index) in vitems" :key="index" :class="['breadcrumb-item', {active: index===vitems.length-1}]"><span v-if="index===vitems.length-1">{{item.text}}</span><a v-else :href="item.link||'#'">{{item.text}}</a></li>
            </ol>
        </nav>`,
    editor: `<div v-for="(item, index) in items">
            <editor-text :name="'vitems.' + index + '.text'" :value="item.text"></editor-text>
            <editor-text :name="'vitems.' + index + '.link'" :value="item.link"></editor-text>
            <editor-button text="移除" :handler="'this.vitems.splice(' + index + ', 1)'"></editor-button>
            <hr class="my-4">
        </div>
        <editor-button text="新增" handler="this.vitems.push({text:'New Item'})"></editor-button>`,
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
    data() {
        let items = [], children = this.$slots.default;
        for (let i = 0, len = children.length; i < len; i++) {
            let item = children[i], text = VTool.text(item);
            if (text) {
                items.push({
                    link: VTool.attr(item, 'href'),
                    text: text
                });
            }
        }
        return {
            vitems: items
        }
    }
})