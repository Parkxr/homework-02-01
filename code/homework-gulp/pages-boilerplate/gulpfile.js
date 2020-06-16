// 实现这个项目的构建任务
const { src , dest , series , parallel , watch } = require('gulp')

const del = require('del')
const bs = require('browser-sync').create()

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
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

//清除dist目录
const clean = () =>{
    return del(['dist','temp'])
}

//转换sass文件到指定目录
const style = () =>{
    return src('src/assets/styles/*.scss', {base: 'src'})
        .pipe(plugins.sass())
        .pipe(dest('temp'))
        .pipe(bs.reload({stream:true}))
}

//转换脚本文件到指定目录
const script = () =>{
    return src('src/assets/scripts/*.js', {base: 'src'})
        .pipe(plugins.babel({presets: ['@babel/preset-env']}))
        .pipe(dest('temp'))
        .pipe(bs.reload({stream:true}))
}

//转换html文件到指定目录
const page = ()=>{
    return src('src/**/*.html', {base: 'src'})
        .pipe(plugins.swig({
          data,
          defaults: { cache: false }
        }))
        .pipe(dest('temp'))
        .pipe(bs.reload({stream:true}))
}

//转换图片文件到指定目录
const image = ()=>{
    return src('src/assets/images/**',{base: 'src'})
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

//转换字体文件到指定目录
const font = ()=>{
    return src('src/assets/fonts/**',{base: 'src'})
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

//转换其他文件到指定目录
const extra = ()=>{
    return src('public/**', {base: 'public'})
        .pipe(dest('dist'))
}

//处理引用文件
const useref = ()=>{
  return src('temp/*.html',{base: 'temp'})
    .pipe(plugins.useref({searchPath:['temp','.']}))
    .pipe(plugins.if(/\.js$/,plugins.uglify()))
    .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/,plugins.htmlmin({
      collapseWhitespace:true,
      minifyCSS:true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}
//创建开发服务器
const serve = ()=>{
  watch('src/assets/styles/*.scss' , style)
  watch('src/assets/scripts/*.js' , page)
  watch('src/**/*.html' , page)
  watch(['src/assets/images/**', 'src/assets/fonts/**' ,'public/**'],bs.reload)

  bs.init({
    notify:false,
    open:true,
    port:1989,
    // files:'temp/**',
    server:{
      baseDir:['temp', 'src', 'public'],
      routes:{
        '/node_modules': 'node_modules'
      }
    }
  })
}

const compile = parallel(style, script, page)
const build = series(clean, parallel(series(compile,useref), image, font, extra))
const dev =  series(compile,serve)

module.exports = {compile, build, dev, useref,clean}