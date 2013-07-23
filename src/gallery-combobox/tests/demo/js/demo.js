YUI().use('combo-box', function(Y){
    var comboBox = new Y.ComboBox(),
        items = [];

    for (var i=0; i<10; i++) {
        items.push({
            value : 'value' + i,
            text : 'Option ' + i
        });
    }
    comboBox.set('items', items);

    comboBox.render();
});