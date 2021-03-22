# PHP Application parameters 

Don't forget to fill good parameters in the file /var/shared/met.conf.


# Building javascript part

Install a close version of Sencha cmd 6.2.1.29 and launch

```
sencha app build
```

Be careful, using other version of Sencha Cmd can produce building errors...

# MetExplore/app

This folder contains the javascript files for the application.

# MetExplore/resources

This folder contains static resources (typically an `"images"` folder as well).

# MetExplore/overrides

This folder contains override classes. All overrides in this folder will be 
automatically included in application builds if the target class of the override
is loaded.

# MetExplore/sass/etc

This folder contains misc. support code for sass builds (global functions, 
mixins, etc.)

# MetExplore/sass/src

This folder contains sass files defining css rules corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'MetExplore'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in MetExplore/.sencha/app/sencha.cfg. 

# MetExplore/sass/var

This folder contains sass files defining sass variables corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'MetExplore'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in MetExplore/.sencha/app/sencha.cfg. 
