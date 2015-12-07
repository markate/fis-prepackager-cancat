/**
 * fis.baidu.com
 * DESC:
 * Just a simple concat
   fis not support compile .twig or some other file which with unplain suffix
 * auth: suhongtang
 * 
 */
'use strict';

var path = require('path'),
	_ = fis.util;
/*
@Des 在packager阶段的参数传递
     ret :     这是系统默认进行编译的文件
     pack :    这是设置了pack的文件 
     setting : 这是传输进来的配置
     opt:      过程中中的系统设置
*/
module.exports = function( ret, pack, settings, opt ) { 
	var src = ret.src,
		root = fis.project.getProjectPath();

	/*
	@des 获取所有的源文件
	*/
	var getFileSource = function () {
		var fileList = [];
		/*获取原文件列表*/
		Object.keys(src).forEach(function(key){
			fileList.push(src[key]);
		});
		return fileList;
	};

	/*
	@des 获取所有的符合规则的文件
	@paras sources []  符合规则的文件列表
	*/
	var filterFile =  function(sources, reg) {
		/*如果原文件中有责返回该文件*/
	    if (src[reg]) {
	    	return [src[reg]];
	    } else if (reg === '**') {
	      // do nothing
	    } else if (typeof reg === 'string') {
	    	reg = _.glob(reg);
	    }
	    return sources.filter(function(file) {
	    	reg.lastIndex = 0;
	      	return (reg === '**' || 
	      	reg.test(file.subpath))
	    });
  	};

  	/*
	@des 将一个文件的路径包装成fis要求的文件对象
  	*/
  	var wrapFile = function (packToPath) {
  		return fis.file.wrap(path.join(root, packToPath));
  	};

	/*
	@des : 进行merge文件
	@paras source 源文件数组
		   packToPath 打包到某一个路径底下
	*/
	var concat = function (source, packToPath) {
		/*存放文件内容*/
		var packToFile,
			/*这个打包的文件是否已经存在,如果已经存在需要在fis编译组件里warming*/
			packToExist = false,
			/*内容*/
			content = '';
		/*packTo不存在则退出*/
		if (!packToPath) {
			return 
		}
		/*转化成fis的file格式*/
		packToFile = wrapFile(packToPath);
		/*判断pack的文件是否存在*/
		packToExist = fis.util.isFile(packToFile.fullname);
		/*如果packTo的文件存在，给用户一个提醒*/
		if (packToExist) {
			fis.log.warning(packToFile.fullname + 'has exists. Check your result,please!');
		}
		/*对资源列表进行挨个处理，将文件合并*/
		source.forEach(function (file){
			content += file._content;
		});
		/*将内容设置进入pack的文件夹*/
		packToFile.setContent(content);
		ret.pkg[packToPath] = packToFile;
	};


	/*入口主函数*/
	var main = (function () {
		/*获取原文件列表*/
		var sourceList = getFileSource(),
			match      = settings.match,
			packToPath = settings.packTo,
			filterList = filterFile(sourceList, match);
		concat(filterList, packToPath);
	})();

};
	
	