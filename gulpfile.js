var	gulp    = require('gulp')
  , babel   = require('gulp-babel')
  , concat  = require('gulp-concat')
  // , uglify  = require('gulp-uglify')
  , uglify = require('gulp-uglify-es').default
  , plumber = require('gulp-plumber')
  , using   = require('gulp-using')
  // Define some individual deploy params
  , src_dir         = 'src/'
  , dist_dir        = 'dist/'
  , dist_js_file    = 'lazyloadscripts.min.js'
  , dist_ie_js_file = 'lazyloadscripts.min.ie.js'
  // Package options
  , using_options_processing = { prefix: 'Processing', path: 'cwd', filesize: true }
  , using_options_cleaning   = { prefix: 'Cleaning',   path: 'cwd', filesize: true }

  /**
   * Error handling function for plumber package
   */
  , plumber_handle_err = function(err) {
  	console.log(err)
  	this.emit('end')
  }

var src_js_file     = [
  // src_dir + 'helper/_getScript.js',
  src_dir + 'helper/_isJSON.js',
  src_dir + 'lazyloadscripts.js',
]

var babel_settings = {
  presets: ['@babel/preset-env'],
  plugins: [
    // '@babel/plugin-transform-classes'
    // 'async-to-promises',
    // 'transform-object-assign',
    '@babel/plugin-proposal-object-rest-spread',
  ]
}

/**
 * Build JS files
 */
gulp.task('build-js', function() {
	var stream = gulp
		.src(src_js_file)
		.pipe(plumber({ plumber_handle_err }))
		.pipe(using(using_options_processing))
		.pipe(concat(dist_js_file))

	// After uglifying save into dest-directory
	return stream
		.pipe(uglify(/* { preserveComments: 'license' } */))
		.pipe(gulp.dest(dist_dir))
		.pipe(using(using_options_cleaning))
})

gulp.task('build-js-ie', function() {
	// First concat all js files together and compile babel
	var stream = gulp
		.src(src_js_file)
		.pipe(plumber({ plumber_handle_err }))
		.pipe(using(using_options_processing))
    .pipe(babel(babel_settings))
		.pipe(concat(dist_ie_js_file))

	// After uglifying save into dest-directory
	return stream
		.pipe(uglify(/* { preserveComments: 'license' } */))
		.pipe(gulp.dest(dist_dir))
		.pipe(using(using_options_cleaning))
})

/**
 * Watcher
 */
gulp.task('watch', function() {
	gulp.watch(src_dir + '**/*.js', [ 'build-js', 'build-js-ie' ])
})
