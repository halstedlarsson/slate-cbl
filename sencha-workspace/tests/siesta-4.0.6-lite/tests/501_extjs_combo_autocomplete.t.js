StartTest(function(t) {
    t.diag('Combo field');
    
    t.testExtJS(
        {
            // do not reduce the `actionDelay` 
            actionDelay    : t.actionDelay
        },
        function (t) {
            
            var store = new Ext.data.ArrayStore({
                fields: ['text'],
                data: [
                    ['Form'],
                    ['Grid'],
                    ['Dirty']
                ]
            });
           
            var cmp = new Ext.form.ComboBox({
                fieldLabel      : 'Combo',
                
                displayField    : 'text',
                valueField      : 'text',
                
                allowBlank      : false,
                editable        : true,
                forceSelection  : true,
                selectOnFocus   : true,
                
                mode            : 'local', // Ext 3
                queryMode       : 'local',
                triggerAction   : 'all',
                typeAhead       : true,
                
                store           : store,
                renderTo        : Ext.getBody()
            });
           
            t.chain(
                { click : cmp },
                { type : 'Dir', target : cmp },
                function (next) {
                    t.ok(cmp.hasFocus, "Combo has focus")
                    
                    next()
                },
                //simulate tab key for auto-complete
                { type : '[TAB]', target : cmp },
                {
                    waitFor :  function () {
                        return cmp.getValue() === 'Dirty';
                    }
                }
            )
            
        }
    );
});