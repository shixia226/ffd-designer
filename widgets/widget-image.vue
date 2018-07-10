Vue.component('widget-image', {
    template: `<img :class="vtheme" :src="vsrc" :style="style" @load="$root.$emit('updated')" />`,
    props: ['theme', 'src', 'width', 'height'],
    resizable: true,
    editor: `
        <editor-select label="Style" name="vtheme" :value="theme">
            <option value="img-thumbnail">Thumbnail</option>
            <option value="img-fluid">Fluid</option>
            <option value="rounded">Rounded</option>
            <option value="rounded-circle">Circle</option>
        </editor-select>
        <editor-text label="Width" name="vwidth" :value="width"></editor-text>
        <editor-text label="Height" name="vheight" :value="height"></editor-text>
        <editor-text label="Src" name="vsrc" :value="src"></editor-text>
    `,
    data() {
        return {
            vtheme: this.theme || 'img-thumbnail',
            vwidth: this.width || '',
            vheight: this.height || '',
            vsrc: this.src || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1642fbc36a8%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1642fbc36a8%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.4296875%22%20y%3D%22104.5%22%3E200x200%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
        }
    },
    methods: {
        resize(width, height) {
            this.vwidth = width + 'px';
            this.vheight = height + 'px';
        }
    },
    computed:{
        style(){
            return {
                width: formatSize(this.vwidth),
                height: formatSize(this.vheight)
            }
        }
    }
})
function formatSize(size) {
    if (!size) return '';
    size = size + '';
    let len = size.length - 1;
    return (size[len] === '%' || size.substr(len - 1) === 'px') ? size : (size + 'px');
}