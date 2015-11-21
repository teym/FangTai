var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    less = require('gulp-less');
    /*,
    notify = require('gulp-notify'),
    minifyCss = require('gulp-minify-css')*/

gulp.task('watch', function () {    // 这里的watch，是自定义的，写成live或者别的也行
    var server = livereload();
    // app/**/*.*的意思是 app文件夹下的 任何文件夹 的 任何文件
    gulp.watch('css/**/*.less', function (file) {
        //['css/**/*.less','!css/public']
        gulp.src(['css/**/*.less','!css/public/{base,header,icon,public,reset}.less']) //该任务针对的文件
            .pipe(less()) //该任务调用的模块
            .pipe(gulp.dest('css/')) //将会在src/css下生成index.css
            .pipe(minifyCss())
            .pipe(gulp.dest('css/'));
            //.pipe(notify({ message: 'Styles task complete' }));


//        gulp.src(['css/**/*.less','!css/public/{base,header,icon,public,reset}.less'])
  //        .pipe(gulp.dest('css/'))
   //         .pipe(minifyCss());
    });
});