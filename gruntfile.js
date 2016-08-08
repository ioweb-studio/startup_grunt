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
		concat: {
			options: {
				separator: '',
			},
			css : {
				src: [
					'<%= globalConfig.dev %>/<%= globalConfig.css %>/main.css'
				],
				dest: '<%= globalConfig.assets %>/<%= globalConfig.css %>/main.css'
			},
			js : {
				src : [
					'<%= globalConfig.jq %>/dist/jquery.js',
					'<%= globalConfig.bs %>/dist/js/bootstrap.js',
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/main.js'
				],
				dest: '<%= globalConfig.tmp %>/<%= globalConfig.js %>/main.js'
			}
		},
		uglify : {
			options: {
				ASCIIOnly: true
			},
			main: {
				files: {
					'<%= globalConfig.assets %>/<%= globalConfig.js %>/main.js': [
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
							'<%= globalConfig.dev %>/<%= globalConfig.img %>/*.{png,jpg,gif}'
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
						src: [
							'<%= globalConfig.dev %>/<%= globalConfig.img %>/optimized/*'
						],
						dest: '<%= globalConfig.assets %>/<%= globalConfig.img %>/',
						filter: 'isFile'
					}
				]
			}
		},
		watch: {
			js: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.js %>/*.js'
				],
				tasks: ['notify:watch','uglify','notify:done']
			},
			css: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.css %>/*.less',
					'<%= globalConfig.dev %>/<%= globalConfig.css %>/mixins/*.less',
				],
				tasks: ['notify:watch','less','notify:done']
			},
			images: {
				files: [
					'<%= globalConfig.dev %>/<%= globalConfig.img %>/*.{png,jpg,gif}'
				],
				tasks: ['notify:watch','imagemin', 'copy:images', 'less','notify:done']
			},
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
	
	grunt.registerTask('default', 	['notify:watch','imagemin', 'uglify', 'copy', 'less','notify:done']);
	grunt.registerTask('dev', 		['watch']);
	
};