/**
 * Singleton class to handle Ajax queries
 * MetExplore.globals.MetExploreAjax
 */
Ext.define('MetExplore.globals.MetExploreAjax', {

    singleton: true,

    config: {

        /**
         * @cfg {Number} timeout Timeout of the query
         */
        timeout: 120 * 1000,

        /**
         * @cfg {Boolean} useDefaultXhrHeader Set this to false to not send the
         *      default Xhr header (X-Requested-With) with every request. This
         *      should be set to false when making CORS (cross-domain) requests.
         */
        useDefaultXhrHeader: true,

        /**
         * @cfg {Boolean} withCredentials This configuration is sometimes
         *      necessary when using cross-origin resource sharing.
         */
        withCredentials: false,

        /**
         * @cfg {String} method The default HTTP method to be used for requests.
         *      Note that this is case-sensitive and should be all caps
         * 
         */
        method: "POST",

        /**
         * @cfg {String} serverFailureMessage Message displayed when server
         *      error
         * 
         */
        serverFailureMessage: "Server error",

        /**
         * @cfg {String} jsonFailureMessage Message displayed when json reading
         *      fails
         * 
         */
        jsonFailureMessage: "Bad response from the server",

        /**
         * @cfg {function} successFunction Function launched when the json has
         *      its success key set to the success Value
         * 
         */
        successFunction: function() {},

        /**
         * @cfg {function} failureFunction Function launched when the reading of
         *      the json fails
         * 
         */
        failureFunction: function() {},

        /**
         * @cfg {function} callback Function launched after the response of the
         *      server is received
         * 
         */
        callback: function() {

        },

        /**
         * @cfg {Object} scope Scope of the functions
         * 
         */
        scope: this,

        /**
         * @cfg {String} successValue Success value to test in the
         *      json["success"]
         * 
         */
        successValue: "true",

        /**
         * @cfg {String} url url to send the query
         */
        url: "",

        /**
         * @cfg {String} waitMessage* Message displayed during the server
         *      connection
         */
        waitMessage: "Server connection..."

    },

    /**
     * Build params of the query
     * 
     * Copy all the parameters set in {@link Archive.globals.WbParameters} Set
     * the external tool parameter
     * 
     * @param {Object}
     *            c config. Can override paramereters contained in the class
     *            config
     */
    buildParams: function(c) {

        var config;

        if (Ext.isDefined(c)) {
            config = Ext.clone(c);
        } else {
            config = {};
        }

        return config;

    },

    /**
     * Send ajax archive
     * 
     * @param {Object}
     *            params to send to the server
     */
    send: function(params) {

        var config = Ext.clone(this.config);

        config = Ext.apply(config, params, config);

        config = this.buildParams(config);

        var win_wait = null;

        if (config.waitMessage != "") {
            win_wait = Ext.create("Ext.window.MessageBox");

            win_wait.wait(config.waitMessage, "Please Wait...");
        }

        var ajax = Ext.create("Ext.data.Connection", {
            useDefaultXhrHeader: config.useDefaultXhrHeader
        });

        ajax.request({
            url: config.url,
            params: config.params,
            scope: config.scope,
            withCredentials: config.withCredentials,
            method: config.method,
            timeout: config.timeout,
            failure: function(response, opts) {
                config.failureFunction(response, opts);
                if (config.waitMessage != "") {
                    win_wait.close();
                }
                if (config.serverFailureMessage != "") {
                    Ext.create("Ext.window.MessageBox")
                        .alert("Server Error",
                            config.serverFailureMessage);
                }
            },
            success: function(response, opts) {

                var json = null;

                try {
                    json = Ext.decode(response.responseText);
                } catch (e) {
                    config.failureFunction(response, opts);
                    if (config.waitMessage != "") {
                        win_wait.close();
                    }
                    if (config.jsonFailureMessage != "") {
                        Ext.create("Ext.window.MessageBox").alert(
                            "Server error",
                            config.jsonFailureMessage);
                    }
                }

                if (json != null) {

                    if (json["success"] != config.successValue) {
                        config.failureFunction(response, opts);
                        if (config.waitMessage != "") {
                            win_wait.close();
                        }
                        Ext.create("Ext.window.MessageBox").alert(
                            "Failed",
                            (Ext.isDefined(json["message"])) ?
                            json["message"] :
                            "Unknown error");

                        if (Ext.isDefined(json["login"]) &&
                            json["login"] == "false") {
                            Archive.globals.GlobalActions.logout();
                        }

                    } else {

                        config.successFunction(json);
                        if (config.waitMessage != "") {
                            win_wait.close();
                        }
                    }

                }
            },
            callback: function(response, opts) {
                config.callback();
            }

        });

    }
});