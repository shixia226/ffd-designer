import VTool from '../common/v-tool';

Vue.component('widget-dropdown', {
    template: `<div :class="'drop' + vdirection">
            <button :class="['btn dropdown-toggle', vtheme ? 'btn-' + vtheme : '', vsize ? 'btn-' + vsize : '']" type="button" data-toggle="dropdown">{{vbutton}}</button>
            <div class="dropdown-menu">
                <template v-for="(item, index) in vitems">
                    <a v-if="item.text!=='-'" class="dropdown-item" :href="item.link" :key="item.id">{{item.text}}</a>
                    <div v-if="item.text==='-'" class="dropdown-divider" :key="item.id"></div>
                </template>
            </div>
        </div>`,
    props: ['direction', 'theme', 'size'],
    editor: `<editor-size :value="size"></editor-size>
        <editor-theme :value="theme" outline="true"></editor-theme>
        <editor-text name="vbutton" :value="button" label="Downdown Text"></editor-text>
        <hr class="my-4">
        <widget-collapse>
            <div v-for="(item, index) in items" :key="item.id">
                <editor-text :name="'vitems.' + index + '.text'" :value="item.text" label="Item Text"></editor-text>
                <editor-text :name="'vitems.' + index + '.link'" :value="item.link" label="Item Link"></editor-text>
                <editor-button text="Remove" :handler="'this.vitems.splice(' + index + ', 1)'"></editor-button>
            </div>
        </widget-collapse>
        <hr class="my-4">
        <editor-button text="Add" handler="this.$options.add(this)"></editor-button>`,
    save(vm, html, space = '') {
        html = html || [];
        html.push(`${space}<button>${vm.vbutton}</button>`);
        let items = vm.vitems;
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i];
            html.push(`${space}<a href="${item.link||''}">${item.text||'-'}</a>`);
        }
        return html;
    },
    add(vm) {
        vm.vitems.push({text: 'New Item', link: '', id: VTool.random()});
    },
    data() {
        let children = this.$slots.default, button, items = [];
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                let node = children[i], tag = node.tag, text = VTool.text(node);
                if (tag === 'button') {
                    button = text || 'Dropdown';
                } else if(text) {
                    items.push({
                        id: VTool.random(),
                        link: VTool.attr(node, 'href'),
                        text: text
                    });
                }
            }
        }
        return {
            vdirection: this.direction || 'down',
            vtheme: this.theme || 'secondary',
            vsize: this.size || '',
            vbutton: button,
            vitems: items
        }
    }
})