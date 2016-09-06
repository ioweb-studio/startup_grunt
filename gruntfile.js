module.exports = function(grunt) {
	var gc = {
		assets: 'assets/templates/ioweb',
		dev: 'develop',
		css: 'css',
		js: 'js',
		img: 'images',
		fonts: 'fonts',
		tmp: 'test',
		bc: "bower_components",
		jq : 'bower_components/jquery',
		bs : 'bower_components/bootstrap',
		ftp: {
			username: "login",
			password: "password",
			host: "host",
			dest: "/public_html/",
			port: 21,
			incrementalUpdates: true
		},
		ftp_enabled: true
	},
	message = "ProjectSoft";
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		less: {
			css: {
				files : {
					'<%= globalConfig.assets %>/<%= globalConfig.css %>/main.css' : [
						'<%= globalConfig.bs %>/less/bootstrap.less',
						'<%= globalConfig.bs %>/less/theme.less',
						'<%= globalConfig.dev %>/<%= globalConfig.css %>/main.less'
					]
				},
				options : {
					compress: true,
					ieCompat: false
				}
			}
		},
		modernizr: {
			dist: {
				"crawl": false,
				"customTests": [],
				"dest": "<%= globalConfig.tmp %>/modernizr-output.js",
				"tests": [
					"pointerevents",
					"svg",
					"touchevents",
					"video",
					"objectfit",
					"cssvhunit",
					"cssvmaxunit",
					"cssvminunit",
					"cssvwunit",
					"videoautoplay",
					"videoloop"
				],
				"options": [
					"domPrefixes",
					"prefixes",
					"addTest",
					"atRule",
					"hasEvent",
					"mq",
					"prefixed",
					"prefixedCSS",
					"prefixedCSSValue",
					"testAllProps",
					"testProp",
					"testStyles",
					"html5printshiv",
					"html5shiv",
					"setClasses"
				],
				"uglify": false
			}
		},
		uglify : {
			options: {
				ASCIIOnly: true
			},
			main: {
				files: {
					'<%= globalConfig.assets %>/<%= globalConfig.js %>/main.js': [
						'<%= globalConfig.tmp %>/modernizr-output.js',
						'<%= globalConfig.jq %>/dist/jquery.js',
						'<%= globalConfig.bs %>/dist/js/bootstrap.js',
						'<%= globalConfig.dev %>/<%= globalConfig.js %>/main.js'
					]
				}
			}
		},
		imagemin: {
			base: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'<%= globalConfig.dev %>/<%= globalConfig.img %>/*.{png,jpg,gif,svg}'
						],
						dest: '<%= globalConfig.dev %>/<%= globalConfig.img %>/optimized/',
						filter: 'isFile'
					}
				]
			}
		},
		copy : {
			fonts: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'<%= globalConfig.bs %>/fonts/*',
							'<%= globalConfig.dev %>/<%= globalConfig.fonts %>/*'
						],
						dest: '<%= globalConfig.assets %>/<%= globalConfig.fonts %>/',
						filter: 'isFile'
					},
				]
			},
			images : {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'<%= globalConfig.dev %>/<%= globalConfig.img %>/optimized/*'
						],
						dest: '<%= globalConfig.assets %>/<%= globalConfig.img %>/',
						filter: 'isFile'
					}
				]
			}
		},
		ftp_push: {
			dist: {
				options: gc.ftp,
				files: [
					{
						expand: true,
						flatten : true,
						filter: 'isFile',
						src: [
							'<%= globalConfig.assets %>/**/*',
							'android*.*',
							'apple*.*',
							'favico*.*',
							'mstile*.*',
							'safari*.*',
							'browserconfig.xml',
							'.htaccess',
							'index.html',
							'manifest.json'
						]
					}
				]
			}
		},
		watch: {
			js: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/*.js'
				],
				tasks: gc.ftp_enabled ? ['notify:watch','modernizr','uglify','ftp_push','notify:done'] : ['notify:watch','modernizr','uglify','notify:done']
			},
			fonts: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.fonts %>/*.*'
				],
				tasks: gc.ftp_enabled ? ['notify:watch','copy:fonts','ftp_push','notify:done'] : ['notify:watch','copy:fonts','notify:done']
			},
			css: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.css %>/*.less',
					'<%= globalConfig.dev %>/<%= globalConfig.css %>/mixins/*.less',
				],
				tasks: gc.ftp_enabled ? ['notify:watch','less','ftp_push','notify:done'] : ['notify:watch','less','notify:done']
			},
			images: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.img %>/*.{png,jpg,gif,svg}'
				],
				tasks: gc.ftp_enabled ? ['notify:watch','imagemin', 'copy:images', 'less','ftp_push','notify:done'] : ['notify:watch','imagemin', 'copy:images', 'less','notify:done']
			},
			html: {
				files: [
					'*.html'
				],
				tasks: gc.ftp_enabled ? ['notify:watch','ftp_push','notify:done'] : ['notify:watch','notify:done']
			}
		},
		notify: {
			watch: {
				options: {
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: 'Запуск',
					image: __dirname+'\\notify.png'
				}
			},
			done: {
				options: { 
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: "Успешно Завершено",
					image: __dirname+'\\notify.png'
				}
			}
		}
	});
	
	grunt.registerTask('default', 	['notify:watch','imagemin', 'modernizr', 'uglify', 'copy', 'less','ftp_push','notify:done']);
	grunt.registerTask('dev', 		['watch']);
	
};