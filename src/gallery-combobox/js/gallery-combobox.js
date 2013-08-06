/**
 * Features wanted:
 * - configure if allowed to enter new values via the input
 *   (and if those values should be added to the options list)
 * - options navigation using keyboard
 * - when typing in the input, show the filtered options
 */
Y.ComboBox = Y.Base.create('comboBox', Y.Widget, [], {
    BOUNDING_TEMPLATE : "<span></span>",
    CONTENT_TEMPLATE : null,
    _valueInput : null,
    _optionsContainer : null,
    _selectedItemWidget : null,
    _clickOutsideSub : null,

    initializer : function(config) {
        this.publish('optionChanged');
    },

    renderUI : function() {
        var items = this.get('items'),
            selectedValue = this.get('selectedValue');

        this._createUi();
        this._addAllItems(items);
        this._setSelectedValue(selectedValue);
    },

    bindUI : function() {
        var contentBox = this.get('contentBox');

        contentBox.delegate('click', this._onOptionClick, '.option', this);
        contentBox.one('.input-container').on('click', this._toggleContainer, this);
    },

    _onOptionClick : function(ev) {
        var option = ev.target,
            value = option.getAttribute('value');

        this._hideContainer();

        this.set('selectedValue', value);

        this.fire('optionChanged', {
            value : value
        });
    },

    _setSelectedValue : function(value) {
        var itemWidget,
            itemText,
            defaultText;

        if (value == null) {
            defaultText = this.get('defaultText');
            this._valueInput.set('value', defaultText);

            return;
        }

        itemWidget = this._findItemWidget(value);
        if (itemWidget) {
            this._selectItemWidget(itemWidget);

            itemText = itemWidget.get('text');
            this._valueInput.set('value', itemText);
        }
    },

    _selectItemWidget : function(itemWidget) {
        if (this._selectedItemWidget) {
            this._selectedItemWidget.removeClass('selected');
        }
        this._selectedItemWidget = itemWidget;

        itemWidget.addClass('selected');
    },

    _createUi : function() {
        var contentTemplate = "" +
                "<span class='input-container'><input class='value-input'/><span class='show-button'></span></span>" +
                "<div class='options'></div>",
            contentNode = Y.Node.create(contentTemplate);

        this._valueInput = contentNode.one('.value-input');
        this._optionsContainer = contentNode.one('.options');
        this._optionsContainer.hide();

        this.get('contentBox').append(contentNode);
    },

    _toggleContainer : function(ev) {
        if (this._optionsContainer._isHidden()) {
            this._showContainer();
        } else {
            this._hideContainer();
        }

        ev.stopPropagation();
    },

    // TODO Scroll to the selected item
    _showContainer : function() {
        this._positionContainer();
        this._optionsContainer.show();

        if (this._selectedItemWidget) {
            this._selectedItemWidget.scrollIntoView();
        }

        this._clickOutsideSub = this._optionsContainer.on('clickoutside', this._hideContainer, this);
    },

    _hideContainer : function() {
        this._optionsContainer.hide();

        if (this._clickOutsideSub) {
            this._clickOutsideSub.detach();
        }
    },

    hideOptionsContainer : function() {
        if (!this._optionsContainer._isHidden()) {
            this._hideContainer();
        }
    },

    _positionContainer : function() {
        var contentBox = this.get('contentBox'),
            xy = contentBox.getXY(),
            height = contentBox.get('offsetHeight') + 2; // add the border

        this._optionsContainer.setStyles({
            left: xy[0] + 'px',
            top: (xy[1] + height) + 'px'
        })
    },

    _addAllItems : function(items) {
        if (!items) {
            return;
        }

        for (var i=0; i<items.length; i++) {
            this._addItemWidget(items[i]);
        }
    },

    add : function(item) {
        this._addItem(item);
        this._addItemWidget(item);
    },

    remove : function(itemValue) {
        this._removeItem(itemValue)
        this._removeItemWidget(itemValue)
    },

    _addItemWidget : function(item) {
        var optionNode = Y.Node.create("<div class='option'></div>");

        optionNode.set('text', item.text || item.value);
        optionNode.setAttribute('value', item.value || item.text);

        this._optionsContainer.appendChild(optionNode);
    },

    _removeItemWidget : function(itemValue) {
        var itemWidget = this._findItemWidget(itemValue);

        if (itemWidget) {
            itemWidget.remove(true);
        }
    },

    _findItemWidget : function(itemValue) {
        var options = this.get('contentBox').all('.options .option'),
            foundOption = null;

        options.some(function(option){
            if (option.getAttribute('value') == itemValue) {
                foundOption = option;
                return true;
            }
        });

        return foundOption;
    },

    _addItem : function(item) {
        this.get('items').push(item);
    },

    _removeItem : function(value) {
        var items = this.get('items');

        for (var i=0; i<items.length; i++) {
            if (items[i].value == value) {
                items.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}, {
    ATTRS : {
        items : {
            writeOnce : true,
            setter : function(value) {
                if (this.get('rendered')) {
                    this._addAllItems(value);
                }

                return value;
            }
        },
        selectedValue : {
            setter : function(value) {
                this._setSelectedValue(value);

                return value;
            }
        },
        defaultText : {
            value : ''
        }
    }
});