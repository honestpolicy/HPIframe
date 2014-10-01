var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    pkg = require('./bower.json'),
    jasmine = require('gulp-jasmine'),
    prompt = require('prompt'),
    coffee = require('gulp-coffee'),
    git = require('gulp-git'),
    wait = require('gulp-wait'),
    removeLogs = require('gulp-removelogs'),
    notify = require('gulp-notify'),
    header = require('gulp-header');

var banner = ['/**', ' * <%= pkg.name %> ', ' * @version v<%= pkg.version %> ', ' * @link <%= pkg.homepage %> ', ' * @license <%= pkg.license %> ', ' */ \n\n'].join("\n");

/*
  Default Gulp Task. Can be ran via the following commands.
    ```bash
      gulp
      gulp code
    ```

  This will watch any changes on files within src
    Then run jshint and test the code

 */

var code = function(){
  gulp.watch(['src/*', 'tests/*'], function(){
    gulp.src('src/*.js')
      .pipe(jshint()) // JSHint
      .pipe(jshint.reporter('default'));

    testCode();
  });
}

/*
  Build Tools. This function can be ran at command line by:
    `gulp build --type STRING`

  It will run a jslint, code test, version bump,
    uglifyier, minifiyer, console.log remover, script header.

  @params (String) build bump ammount
    major = first number = 1.0.0
    minor = second number = 0.1.0
    patch = third number = 0.0.1

  @params (BashArg) --release Optional.
    If this is passed, it will push the code to github
    and create a release.
 */

var buildDist = function(){
  var bumpTypes = ['major', 'minor', 'patch'];
  var bumpType = gutil.env.type;

  if (!bumpType) {
    console.log("\nYou must pass a build bump type [major, minor, patch]");
    console.log("\nRun the function again passing --type. \n i.e.  gulp build --type patch\n");
    return;
  }

  // Check if type matches a needed bump version
  if (bumpTypes.lastIndexOf(bumpType.toLowerCase()) == -1)
    return console.log("\nInvalid build type. Must be major, minor, or patch\n");

  prompt.start();
  prompt.get('Confirm Build Process (y/n)', function(err, result){
    result = result[Object.keys(result)[0]]
    if (result != 'y') return;

    testCode(); // Run Tests

    // Bump Version number
    gulp.src('./bower.json')
      .pipe(bump({ type: bumpType.toLowerCase() }))
      .pipe(gulp.dest('./'));

    // Build Minified and unminified Javascript
    gulp.src('src/*.js')
      .pipe(jshint()) // jslint
      .pipe(jshint.reporter('default'))
      .pipe(header(banner, {pkg: pkg}))
      .pipe(uglify()) // Uglify && Minify
      .pipe(removeLogs())
      .pipe(rename(pkg.name + '.min.js'))
      .pipe(gulp.dest('dist'))

    gulp.src('src/*.js')
      .pipe(jshint()) // jslint
      .pipe(jshint.reporter('default'))
      .pipe(removeLogs())
      .pipe(header(banner, {pkg: pkg}))
      .pipe(rename(pkg.name + '.js'))
      .pipe(gulp.dest('dist'))

    // Create Github Release
    if (gutil.env.release){
      var tagName = "v" + pkg.version;

      gulp.src('./')
        .pipe(wait(2000))
        .pipe(git.add())
        .pipe(git.commit("[RELEASE: "+ pkg.version +"]" + pkg.name + " " + Date.now()))
        .pipe(git.push('origin', 'master'))
        .pipe(git.tag(tagName, pkg.version + "Release"))
        .pipe(git.push('origin', tagName));
    }

  });
}

/*
  Test Tool. This function can be ran at command line by:
    `gulp test`

  It will compile coffeescript jasmine tests and run them
 */

var testCode = function(){
  gulp.src('./tests/*.js')
    .pipe(jasmine()); // Run jasmine tests
}


/*
  Bash Implementations.
 */

gulp.task('default', code);
gulp.task('code', code);
gulp.task('build', buildDist);
gulp.task('test', testCode);
