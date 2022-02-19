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
                            "@text-color": "#1F2937",
                            "@text-color-secondary": "#4B5563",
                            "@input-placeholder-color": "#9CA3AF",
                            "@table-header-color" : "#6B7280",
                            "@table-header-bg" : "#FFFFFF",
                            "@border-radius-base": "6px",
                            "@font-size-base": "16px",
                            "@font-family": "'Inter', 'system-ui'",
                            "@height-base": "44px",
                            "@btn-font-weight": "500",
                            "@pagination-item-size": "32px",
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
