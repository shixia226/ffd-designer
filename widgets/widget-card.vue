import VTool from '../common/v-tool';

Vue.component('widget-card', {
    template: `<div class="card">
            <div class="card-header" v-if="vheader">{{vheader}}</div>
            <img class="card-img-top" :src="vlogo" v-if="vlogo"/>
            <div class="card-body">
                <h5 class="card-title" v-if="vtitle">{{vtitle}}</h5>
                <h6 class="card-subtitle mb-2 text-muted" v-if="vsubTitle">{{vsubTitle}}</h6>
                <p class="card-text" v-if="vtext">{{vtext}}</p>
            </div>
            <div class="card-footer text-muted" v-if="vfooter">{{vfooter}}</div>
        </div>`,
    editor: `<editor-text name="vheader" :value="header" label="Header"></editor-text>
        <editor-text name="vlogo" :value="logo" label="Logo"></editor-text>
        <editor-text name="vtitle" :value="title" label="Title"></editor-text>
        <editor-text name="vsubTitle" :value="subTitle" label="SubTitle"></editor-text>
        <editor-text name="vtext" :value="text" label="Text"></editor-text>
        <editor-text name="vfooter" :value="footer" label="Footer"></editor-text>`,
    save(vm, html, space = '') {
        html = html || [];
        html.push(`${space}<h1 name="header">${vm.vheader||''}</h1>
            ${vm.vlogo ? space + `<img name="logo" src="${vm.vlogo}" />` : ''}
            ${space}<h2 name="title">${vm.vtitle||''}</h2>
            ${space}<h3 name="subTitle">${vm.vsubTitle||''}</h3>
            ${space}<p name="text">${vm.vtext||''}</p>
            ${space}<h1 name="footer">${vm.vfooter||''}</h1>`.replace(/ +\n/g, ''));
        return html;
    },
    data() {
        let data = {
            vheader: undefined,
            vlogo: undefined,
            vtitle: undefined,
            vsubTitle: undefined,
            vtext: undefined,
            vfooter: undefined,
        }, children = this.$slots.default;
        if (children) {
            for (let i = 0, len = children.length; i < len; i++) {
                let item = children[i], name = VTool.attr(item, 'name');
                if (name) {
                    data['v' + name] = name === 'logo' ? VTool.attr(item, 'src') : VTool.text(item);
                }
            }
        }
        return data;
    }
})