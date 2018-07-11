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
                document.querySelector('.modal-body').innerHTML = designer.html();
                new Vue({
                    el: '.modal-body',
                    replace: false
                })
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