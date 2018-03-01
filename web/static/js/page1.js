var componentPage1 = Vue.extend({
    template: '#page1',
    props: ['pagedata']
});

Vue.component('page1', componentPage1)