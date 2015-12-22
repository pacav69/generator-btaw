'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function () {
    var testLocal;

    generators.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });

    if (this.options['test-framework'] === 'mocha') {
      testLocal = require.resolve('generator-mocha/generators/app/index.js');
    } else if (this.options['test-framework'] === 'jasmine') {
      testLocal = require.resolve('generator-jasmine/generators/app/index.js');
    }

    this.composeWith(this.options['test-framework'] + ':app', {
      options: {
        'skip-install': this.options['skip-install']
      }
    }, {
      local: testLocal
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include Bootstrap Boilerplate and a Gruntfile to build your app.'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      }, 
      // {
      //   name: 'Bootstrap',
      //   value: 'includeBootstrap',
      //   checked: true
      // }, 
      {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    },
    {
        name: 'websitetitle',
        message: 'Website Title',
        'default': 'MyWebsite'
    },
    {
        name: 'navbarbrandtitle',
        message: 'Navbar Brand',
        'default': 'Mynavbarbrandtitle'
    },

    // , {
    //   type: 'confirm',
    //   name: 'includeJQuery',
    //   message: 'Would you like to include jQuery?',
    //   default: true,
    //   when: function (answers) {
    //     return answers.features.indexOf('includeBootstrap') === -1;
    //   }
    //}
    ];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeJQuery = answers.includeJQuery;
      this.websitetitle = answers.websitetitle;
      this.navbarbrandtitle = answers.navbarbrandtitle;
      

      done();
    }.bind(this));
  },

  writing: {
    configyml: function () {
      this.fs.copy(
        this.templatePath('_config.yml'),
        this.destinationPath('_config.yml')
      );
    },
    bower: function () {
    this.fs.copy(
        this.templatePath('bower.json'),
        this.destinationPath('bower.json')
      )
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },
    markdoc: function () {
    this.fs.copy(
        this.templatePath('changelog.md'),
        this.destinationPath('changelog.md')
      )
      this.fs.copy(
        this.templatePath('readme.md'),
        this.destinationPath('readme.md')
      );
    },
    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },
    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },
    gruntfile: function () {
      this.fs.copy(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
        ,
        {
          pkg: this.pkg,
        //   includeSass: this.includeSass,
        //   includeBootstrap: this.includeBootstrap,
        //   includeModernizr: this.includeModernizr,
        //   testFramework: this.options['test-framework'],
        //   useBabel: this.options['babel']
        }
      );
    },
    jshintrc: function () {
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    },
    license: function () {
      this.fs.copy(
        this.templatePath('license.txt'),
        this.destinationPath('.license.txt')
      );
    },
    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        {
          includeSass: this.includeSass,
          includeModernizr: this.includeModernizr,
          testFramework: this.options['test-framework'],
          useBabel: this.options['babel']
        }
      )
    },
    travisyml: function () {
      this.fs.copy(
        this.templatePath('travis.yml'),
        this.destinationPath('.travis.yml')
      );
    },
    appwrite: function () {
      this.fs.copy(
        this.templatePath('src'),
        this.destinationPath('src')

      );
    },
    dotwrite: function () {
      this.fs.copy(
        this.templatePath('src/assets/js/.jshintrc'),
        this.destinationPath('src/assets/js/.jshintrc')

      );
    },


 

    // bower: function () {
    //   var bowerJson = {
    //     name: _s.slugify(this.appname),
    //     private: true,
    //     dependencies: {}
    //   };

    //   if (this.includeBootstrap) {
    //     if (this.includeSass) {
    //       bowerJson.dependencies['bootstrap-sass'] = '~3.3.5';
    //       bowerJson.overrides = {
    //         'bootstrap-sass': {
    //           'main': [
    //             'assets/stylesheets/_bootstrap.scss',
    //             'assets/fonts/bootstrap/*',
    //             'assets/javascripts/bootstrap.js'
    //           ]
    //         }
    //       };
    //     } else {
    //       bowerJson.dependencies['bootstrap'] = '~3.3.5';
    //       bowerJson.overrides = {
    //         'bootstrap': {
    //           'main': [
    //             'less/bootstrap.less',
    //             'dist/css/bootstrap.css',
    //             'dist/js/bootstrap.js',
    //             'dist/fonts/*'
    //           ]
    //         }
    //       };
    //     }
    //   } else if (this.includeJQuery) {
    //     bowerJson.dependencies['jquery'] = '~2.1.4';
    //   }

    //   if (this.includeModernizr) {
    //     bowerJson.dependencies['modernizr'] = '~2.8.3';
    //   }

    //   this.fs.writeJSON('bower.json', bowerJson);
    //   this.fs.copy(
    //     this.templatePath('bowerrc'),
    //     this.destinationPath('.bowerrc')
    //   );
    // },



    // scripts: function () {
    //   this.fs.copy(
    //     this.templatePath('main.js'),
    //     this.destinationPath('app/scripts/main.js')
    //   );
    // },

    // styles: function () {
    //   var stylesheet;

    //   if (this.includeSass) {
    //     stylesheet = 'main.scss';
    //   } else {
    //     stylesheet = 'main.css';
    //   }

    //   this.fs.copyTpl(
    //     this.templatePath(stylesheet),
    //     this.destinationPath('app/styles/' + stylesheet),
    //     {
    //       includeBootstrap: this.includeBootstrap
    //     }
    //   )
    // },

    // html: function () {
    //   var bsPath;

    //   // path prefix for Bootstrap JS files
    //   if (this.includeBootstrap) {
    //     if (this.includeSass) {
    //       bsPath = '/bower_components/bootstrap-sass/assets/javascripts/bootstrap/';
    //     } else {
    //       bsPath = '/bower_components/bootstrap/js/';
    //     }
    //   }
// console.log('websitetitle =',this.websitetitle);
// generators.Base.extend({
//   writing: function () {
//     this.fs.copyTpl(
//       this.templatePath('index.html'),
//       this.destinationPath('public/index.html'),
//       { title: 'Templating with Yeoman' }
//     );
//   }
// });
      // this.fs.copyTpl(
      //   // console.log('websitetitle'),
        
      //   this.templatePath('app/index.html'),
      //   this.destinationPath('app/index.html'),
      //   {
      //     appname: this.appname,
      //     // this.description = props.description;
      //     websitetitle: this.websitetitle,
      //     navbarbrandtitle: this.navbarbrandtitle,
          
      //     includeSass: this.includeSass,
      //     includeBootstrap: this.includeBootstrap,
      //     includeModernizr: this.includeModernizr,
      //     bsPath: bsPath,
      //     bsPlugins: [
      //       'affix',
      //       'alert',
      //       'dropdown',
      //       'tooltip',
      //       'modal',
      //       'transition',
      //       'button',
      //       'popover',
      //       'carousel',
      //       'scrollspy',
      //       'collapse',
      //       'tab'
      //     ]
      //   }
      // );
    },





  //   misc: function () {
  //     mkdirp('app/images');
  //     mkdirp('app/fonts');
  //   }
  // },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  },
  install: function () {
    this.installDependencies({
          npm: true,
          bower: false
        }

      );
  }

  // end: function () {
  //   var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
  //   var howToInstall =
  //     '\nAfter running ' +
  //     chalk.yellow.bold('npm install & bower install') +
  //     ', inject your' +
  //     '\nfront end dependencies by running ' +
  //     chalk.yellow.bold('grunt wiredep') +
  //     '.';

  //   if (this.options['skip-install']) {
  //     this.log(howToInstall);
  //     return;
  //   }

  //   // wire Bower packages to .html
  //   wiredep({
  //     bowerJson: bowerJson,
  //     src: 'app/index.html',
  //     exclude: ['bootstrap.js'],
  //     ignorePath: /^(\.\.\/)*\.\./
  //   });

  //   if (this.includeSass) {
  //     // wire Bower packages to .scss
  //     wiredep({
  //       bowerJson: bowerJson,
  //       src: 'app/styles/*.scss',
  //       ignorePath: /^(\.\.\/)+/
  //     });
  //   }
  //}
});
