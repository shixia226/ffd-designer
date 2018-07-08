export default function(designer, el) {
    new Vue({
        el: el,
        data() {
            return {
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
            }
        }
    })
}