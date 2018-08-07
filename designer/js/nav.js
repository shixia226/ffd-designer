export default function(designer, el) {
    return new Vue({
        el: el,
        data() {
            return {
                page: null,
                preview: false
            }
        },
        watch: {
            preview() {
                let script = $('.preview .modal-body').html(designer.html()).children('textarea').remove().val();
                new Vue({
                    el: '.preview .modal-body',
                    replace: false
                });
                script = script ? JSON.parse(script) : {};
                $('.preview .modal-header .modal-title').html('Preview ~ ' + (script.title || 'UNSET'));
                if ((script = script.script)) {
                    (new Function(script))();
                }
            }
        },
        methods: {
            call(method) {
                method = designer[method];
                if (method) {
                    method.apply(designer, [].slice.call(arguments, 1));
                }
            },
            render(page) {
                this.call('render', this.page = page);
            }
        }
    })
}