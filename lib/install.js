"use strict";
const binBuild = require("bin-build");
const log = require("logalot");
const path = require("path");
const bin = require(".");

/**
 * 使用 bin-wrapper 检测二进制文件是否已经安装成功；
 * 使用 download 尝试下载二进制文件；
 * 如果二进制文件下载失败，则从源码开始编译。
 */
bin
	.run(["-version"])
	.then(() => {
		log.success("cwebp pre-build test passed successfully");
	})
	.catch((error) => {
		log.warn(error.message);
		log.warn("cwebp pre-build test failed");
		log.info("compiling from source");

		// binBuild.file(path.resolve(__dirname, '../vendor/source/libwebp-1.1.0.tar.gz'), [
		// 	`./configure --disable-shared --prefix="${bin.dest()}" --bindir="${bin.dest()}"`,
		// 	'make && make install'
		// ]).then(() => { // eslint-disable-line promise/prefer-await-to-then
		// 	log.success('cwebp built successfully');
		// }).catch(error => {
		// 	log.error(error.stack);

		// 	// eslint-disable-next-line unicorn/no-process-exit
		// 	process.exit(1);
		// });

		const cfg = [
			'./configure --disable-shared --prefix="' + bin.dest() + '"',
			'--bindir="' + bin.dest() + '"',
		].join(" ");

		// 到google官网下载
		const builder = new BinBuild()
			.src(
				"http://downloads.webmproject.org/releases/webp/libwebp-1.2.1.tar.gz"
			)
			.cmd(cfg)
			.cmd("make && make install");

		return builder.run((err) => {
			log.error(err.stack);
			process.exit(1);
		});
	});
