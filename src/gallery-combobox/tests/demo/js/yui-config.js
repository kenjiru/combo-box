/**
 * This configuration is meant to be used from inside a web server.
 * It won't work if run from the local file system.
 */
YUI_config = {
    filter: "raw",
    debug: true,
    combine: true,
    base: 'http://yui.yahooapis.com/3.10.3/build/',

    groups: {
        ColorPickerModules: {
            base: '/build/',
            combine: false,

            modules: {
                'gallery-combobox' : {
                    'skinnable': true
                }
            }
        }
    }
};