import '../plugin/prism/prism.css';
import VTool from '../common/v-tool';
import Prism from '../plugin/prism/prism';

Vue.component('widget-code', {
    template: `<pre :class="['line-numbers', 'language-'+vlanguage]"><code v-html="fmCode"></code></pre>`,
    editor: `<editor-text name="vcode" :value="code" label="Code" multi="260"></editor-text>
        <editor-select label="Language" name="vlanguage" :value="language">
            <option value="javascript">Javascript</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
        </editor-select>`,
    save(vm, html, space = '') {
        html = html || [];
        html.push(vm.vcode);
        return html;
    },
    props: ['language'],
    computed: {
        fmCode() {
            this.$nextTick(() => {
                Prism.highlightAll(this.$el);
            });
            return Prism.highlight(this.vcode, Prism.languages[this.vlanguage], this.vlanguage);
        }
    },
    data() {
        return {
            vlanguage: this.language || 'javascript',
            vcode: VTool.text(this.$slots) || ''
        }
    }
})