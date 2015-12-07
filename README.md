说明：这是一个fis文本简单合并的插件，主要用于普通文件的合并

使用方式：

1、npm install fis-prepackager-cancat

2、使用如下：

fis.match('::package', {
    packager : fis.plugin('concat', {
        match : '/templates/*.twig',
        packTo : '/javascripts/all.js'
    })
});




