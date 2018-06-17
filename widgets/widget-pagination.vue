import VTool from '../common/v-tool';

Vue.component('widget-pagination', {
    template: `<nav>
            <ul :class="['pagination', vsize?'pagination-'+vsize:'', valign?'justify-content-'+valign:'']">
                <li class="page-item"><a class="page-link">{{vpntext ? 'Previous' : '&laquo;'}}</a></li>
                <li class="page-item" v-for="index in vcount"><a class="page-link">{{index-1+vbegin}}</a></li>
                <li class="page-item"><a class="page-link">{{vpntext ? 'Next' : '&raquo;'}}</a></li>
            </ul>
        </nav>`,
    props: ['begin', 'count', 'align', 'pntext', 'size'],
    editor: `<editor-text name="vbegin" :value="begin" type="number" label="Begin"></editor-text>
        <editor-text name="vcount" :value="count" type="number" label="Count"></editor-text>
        <editor-switch name="vpntext" :value="pntext" label="Prev & Next Text"></editor-switch>
        <editor-size :value="size"></editor-size>
        <editor-select label="Alignment" name="valign" :value="align">
            <option value="end">Right</option>
            <option value="">Left</option>
            <option value="center">Center</option>
        </editor-select>`,
    data() {
        return {
            valign: this.align || '',
            vpntext: this.pntext,
            vsize: this.size || '',
            vbegin: parseInt(this.begin, 10) || 1,
            vcount: parseInt(this.count, 10) || 3
        }
    },
    watch: {
        vbegin(){
            this.vbegin = parseInt(this.vbegin, 10);
        },
        vcount() {
            this.vcount = parseInt(this.vcount, 10);
        }
    }
})