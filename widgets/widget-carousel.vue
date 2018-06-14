import VTool from '../common/v-tool';

Vue.component('widget-carousel', {
    template: `<div :id="id" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators" v-if="vindicators">
                <li :data-target="'#' + id" v-for="(item, index) in vitems" :data-slide-to="index" :class="{active:index===0}"></li>
            </ol>
            <div class="carousel-inner">
                <div v-for="(item, index) in vitems" :class="['carousel-item', {active: index===0}]" :key="item.id">
                    <img class="d-block w-100" :src="item.src">
                    <div v-if="item.title" class="carousel-caption d-none d-md-block">
                        <h5>{{item.title}}</h5>
                        <p>{{item.description}}</p>
                    </div>
                </div>
            </div>
            <a v-if="vcontrols" class="carousel-control-prev" :href="'#' + id" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a v-if="vcontrols" class="carousel-control-next" :href="'#' + id" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>`,
    props: ['controls', 'indicators'],
    editor: `<editor-switch name="vcontrols" :value="this.vcontrols" label="With Controls"></editor-switch>
        <editor-switch name="vindicators" :value="this.vindicators" label="With Indicators"></editor-switch>
        <div v-for="(item, index) in items" :key="item.id">
            <editor-text :name="'vitems.' + index + '.src'" :value="item.src" label="Picture"></editor-text>
            <editor-text :name="'vitems.' + index + '.title'" :value="item.title" label="Title"></editor-text>
            <editor-text :name="'vitems.' + index + '.description'" :value="item.description" label="Description"></editor-text>
            <editor-button text="Remove" :handler="'this.vitems.splice(' + index + ', 1)'"></editor-button>
            <hr class="my-4">
        </div>
        <editor-button text="Add" handler="this.$options.add(this)"></editor-button>`,
    save(vm, space = '') {
        let html = [], items = vm.vitems;
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i];
            html.push(`${space}<div><img name="src" src="${item.src || ''}" /><h3 name="title">${item.title || ''}</h3><h4 name="description">${item.description || ''}</h4></div>`)
        }
        return html.join('');
    },
    add(vm) {
        vm.vitems.push({src: '', title: '', description: '', id: VTool.random()});
    },
    data() {
        let items = [], children = this.$slots.default;
        for (let i = 0, len = children.length; i < len; i++) {
            let nodes = children[i].children;
            if (nodes) {
                let item = { //这里一定要罗列所有的属性，否则当没有某个属性时，vue无法给予该属性监听事件导致编辑更改无法及时相应
                    id: VTool.random(),
                    src: undefined,
                    title: undefined,
                    description: undefined
                };
                for (let k = 0, klen = nodes.length; k < klen; k++) {
                    let node = nodes[k], name = VTool.attr(node, 'name');
                    if (name) {
                        item[name] = name === 'src' ? VTool.attr(node, 'src') : VTool.text(node);
                    }
                }
                items.push(item);
            }
        }
        return {
            id: 'carousel' + this._uid,
            vcontrols: this.controls,
            vindicators: this.indicators,
            vitems: items
        }
    }
})