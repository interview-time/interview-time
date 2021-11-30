const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { 
                            "@primary-color": "#8C2BE3",
                            "@border-radius-base": "6px",
                            "@font-size-base": "16px",
                            "@font-family": "'Inter', 'system-ui'",
                            "@height-base": "44px"                            
                    },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
