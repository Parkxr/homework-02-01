// 实现这个项目的构建任务
const sass = require('sass')
const fs = require('fs')
const loadGruntTasks = require('load-grunt-tasks')
const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
                {
                    name: 'Twitter',
                    link: 'https://twitter.com/w_zce'
                },
                {
                    name: 'About',
                    link: 'https://weibo.com/zceme'
                },
                {
                    name: 'divider'
                },
                {
                    name: 'About',
                    link: 'https://github.com/zce'
                }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date()
}

module.exports = grunt => {
    grunt.initConfig({
        //建立开发服务器
        connect: {
            options: {
                livereload: 35729,
                protocol: 'http',
                port: 9000,
                hostname: '*',
            },
            server: {
                options: {
                    keepalive: true,
                    base: ['release'],
                    open: true
                },
            }
            
        },
        //转换html文件到指定目录
        web_swig: {
            options: {
                swigOptions: {
                    cache: false
                },
                getData: data
            },
            main: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.html"],
                    dest: "release",
                    ext: ".html"
                }]
            }
        },
        //转换sass文件到指定目录
        sass: {
            options: {
                implementation: sass
            },
            main: {
                files: [{
                    expand: true,
                    cwd: "src/assets/styles/",
                    src: ["**/*.scss"],
                    dest: "release/assets/styles/",
                    ext: ".css"
                }]
            }
        },
        //转换脚本文件到指定目录
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: [{
                    expand: true,
                    cwd: "src/assets/scripts/",
                    src: ["**/*.js"],
                    dest: "release/assets/scripts",
                    ext: ".js"
                }]
            }
        },
        //处理引用文件
        useref: {
            html: 'release/*.html',
            temp: 'release'
        },
        //监视文件变化并热更新
        watch: {
            js: {
                files: ['src/assets/scripts/*.js'],
                tasks: ['babel']
            },
            css: {
                files: ['src/assets/styles/*.scss'],
                tasks: ['sass']
            },
            page: {
                files: ['src/*.html'],
                tasks: ['web_swig']
            },
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                },

                files: [  //下面文件的改变就会实时刷新网页
                    'release/*.html',
                    'release/assets/styles/*.css',
                    'release/assets/scripts/*.js',
                ]
            }
        },
        //压缩css文件
        cssmin: {
            main: {
                expand: true,
                cwd: 'release/assets/styles',
                src: '*.css',
                dest: 'dist/assets/styles/',
                ext: '.css'
            }
        },
        //压缩html文件
        htmlmin: {
            options: {
                removeComments: true, //移除注释
                removeCommentsFromCDATA: true,//移除来自字符数据的注释
                collapseWhitespace: true,//无用空格
                collapseBooleanAttributes: true,//失败的布尔属性
                removeAttributeQuotes: true,//移除属性引号      有些属性不可移走引号
                removeRedundantAttributes: true,//移除多余的属性
                useShortDoctype: true,//使用短的跟元素
                removeEmptyAttributes: true,//移除空的属性
                removeOptionalTags: true,//移除可选附加标签
                minifyCSS: true,
                minifyJS: true
            },
            main: {
                expand: true,
                cwd: 'release',
                src: ['*.html'],
                dest: 'dist'
            }
        },
        //压缩图片文件和字体文件
        imagemin: {
            /* 压缩图片大小 */
            main: {
                options: {
                    optimizationLevel: 1 //定义 PNG 图片优化水平
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/images',//原图存放的文件夹
                    src: ['*.{png,jpg,jpeg,gif}'], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
                    dest: 'dist/assets/images' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            },
            font: {
                options: {
                    optimizationLevel: 1 //定义 PNG 图片优化水平
                },
                files: [{
                    expand: true,
                    cwd: 'src/assets/fonts',//原图存放的文件夹
                    src: '**', // 优化 img 目录下所有 png/jpg/jpeg/gif图片
                    dest: 'dist/assets/fonts' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },
        //压缩脚本文件
        uglify: {
            main: {
              files: [{
                expand: true,
                cwd: 'release/assets/scripts',
                src: '*.js',
                dest: 'dist/assets/scripts'
              }]
            }
          }
        
    })
    grunt.registerTask('compile', ['sass', 'babel', 'web_swig'])
    loadGruntTasks(grunt)
}