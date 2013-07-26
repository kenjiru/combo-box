YUI().use('gallery-combobox', function(Y){
    var comboBox = new Y.ComboBox(),
        button = Y.one('#getButton'),
        items = [];

    for (var i=0; i<10; i++) {
        items.push({
            value : 'value' + i,
            text : 'Option ' + i
        });
    }
    comboBox.set('items', items);
    comboBox.set('selectedValue', 'value7');

    comboBox.render();

    button.on('click', function() {
        console.log('value: ' + comboBox.get('selectedValue'));
    });
});