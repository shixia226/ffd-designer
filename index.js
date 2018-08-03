import './index.scss';

import Wiget from './designer/js/widget';
import Designer from './designer/js/designer';

import './widgets/widget-badge.vue';
import './widgets/widget-button.vue';
import './widgets/widget-breadcrumb.vue';
import './widgets/widget-card.vue';
import './widgets/widget-carousel.vue';
import './widgets/widget-dropdown.vue';
import './widgets/widget-collapse.vue';
import './widgets/widget-input.vue';
import './widgets/widget-list.vue';
import './widgets/widget-container.vue';
import './widgets/widget-text.vue';
import './widgets/widget-pagination.vue';
import './widgets/widget-image.vue';
import './widgets/widget-code.vue';

import './editors/editor-theme.vue';
import './editors/editor-switch.vue';
import './editors/editor-text.vue';
import './editors/editor-size.vue';
import './editors/editor-button.vue';
import './editors/editor-select.vue';

Wiget();
Designer.init('home');