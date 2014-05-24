module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Configure Grunt 
	grunt.initConfig({

		// Serve files
		express: {
			all: {
				options: {
					port: 9000,
					hostname: '0.0.0.0',
					bases: ['dist'],
					livereload: true
				}
			}
		},

		// Monitor project files
		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['src/*.html'],
				tasks: ['copy']
			},
			sass: {
				options: {
					livereload: false
				},
				files: ['src/sass/*.scss'],
				tasks: ['sass', 'autoprefixer', 'clean']
			},
			css: {
				files: ['dist/css/*.css']
			},
			js: {
				files: ['dist/js/*.js']
			}
		},

		// Open browser
		open: {
			all: {
				path: 'http://localhost:<%= express.all.options.port %>'
			}
		},

		// Compile Sass
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'src/sass/tmp/main.css': 'src/sass/main.scss'
				}
			}
		},

		// Vendor prefixes
		autoprefixer: {
			css: {
				files: {
					'dist/css/main.css': 'src/sass/tmp/main.css'
				}
			}
		},

		// Clean files and folders
		clean: {
			styles: ['src/sass/tmp']
		},

		// Copy files
		copy: {
			html: {
				expand: true,
				src: 'src/*.html',
				dest: 'dist',
				flatten: true
			},
			js: {
				expand: true,
				src: 'src/js/**/*.js',
				dest: 'dist/js',
				flatten: true
			},
			images: {
				expand: true,
				src: 'src/images/*',
				dest: 'dist/images',
				flatten: true
			}
		}

	});

	// Creates the build task
	grunt.registerTask('build', [
		'sass',
		'autoprefixer',
		'clean',
		'copy'
	]);

	// Creates the server task
	grunt.registerTask('server', [
		'build',
		'express',
		'open',
		'watch'
	]);

	// Creates the default task
	grunt.registerTask('default', ['server']);
};