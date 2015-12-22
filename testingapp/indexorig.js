'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the geometric ' + chalk.red('generator-modernbusiness') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },
    // Generator.prototype._common = function() {
    //   this.template('_package.json', 'package.json');
    //   this.copy('../USAGE', 'USAGE');
    //   this.template('_bower.json', 'bower.json');
    //   return this.copy('_gitignore', '.gitignore');
    // };
  writing: function () {
    this.fs.copy(
      this.templatePath('app'),
        this.destinationPath('app')

    );
  },
    common: function () {
      this.copy('_gitignore', '.gitignore');
      this.copy('_package.json', 'package.json');
    //   this.copy('../USAGE', 'USAGE');
    //   this.template('_bower.json', 'bower.json');
    //   return this.copy('_gitignore', '.gitignore');
    // this.fs.copy(
    //   this.templatePath('app'),
    //     this.destinationPath('app')
      // this.template('_Gruntfile.js', 'Gruntfile.js');

    //);
  },
   
    package: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
          this.destinationPath('package.json')
        // this.template('_Gruntfile.js', 'Gruntfile.js');

      );
    },
      Gruntfile: function () {
      this.fs.copy(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );
    },
    robots: function () {
      this.fs.copy(
        this.templatePath('robots.txt'),
        this.destinationPath('app/robots.txt')
      );
    },
// Generator.prototype.install = function() {
//       if (this.generator.installDependencies) {
//         this.installDependencies({
//           npm: true,
//           bower: false
//         });
//       }
//     };
  install: function () {
    this.installDependencies({
          npm: true,
          bower: false
        }

      );
  }
});
