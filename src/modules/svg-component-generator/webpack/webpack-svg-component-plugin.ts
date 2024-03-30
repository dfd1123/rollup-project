import chokidar from 'chokidar';
import {optimize, Config} from 'svgo';
import {RawSource} from 'webpack-sources';
import SvgComponentGenerator, { SvgComponentGeneratorOption } from '../svgComponentGenerator';

type WebpackPluginOptions = SvgComponentGeneratorOption & {
	svgo?: Omit<Config, 'path'>
};

type Compiler = {
	hooks: {
		emit: {
			tap: (name: string, callback: (stats: unknown) => void) => void;
		};
	};
	assets: any;
};

class WebpackSvgComponentPlugin {
	private readonly svgCompGenertor: SvgComponentGenerator;
	private readonly svgFileDir: string;
	private watcher?: chokidar.FSWatcher;
	private svgo?: Omit<Config, 'path'>;

	constructor({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description, svgo }: WebpackPluginOptions) {
		this.svgFileDir = svgFileDir;
		this.svgo = svgo;
		this.svgCompGenertor = new SvgComponentGenerator({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description });
	}

	async apply(compiler: Compiler) {
		if(this.svgo){
			const svgoOption = this.svgo;
			console.log(compiler.assets)
			const svgFiles = Object.keys(compiler.assets ?? {}).filter((file) => file.endsWith('.svg'));

			await Promise.all(svgFiles.map(async (file) => {
				const originalSource = compiler.assets[file].source();
				const { data } = optimize(originalSource, { ...svgoOption });

				compiler.assets[file] = {
					source: () => data,
					size: () => data.length
				};
			}));
		}
		

		if (process.env.NODE_ENV === 'development') {
			if (!this.watcher) {
				this.watcher = chokidar.watch(this.svgFileDir, { persistent: true, ignored: /\/svg\/types\// });

				this.watcher.on('add', this.svgCompGenertor.generate);
				this.watcher.on('unlink', this.svgCompGenertor.generate);

				process.once('SIGINT', () => {
					if (this.watcher) {
						void this.watcher.close();
					}
					process.exit(0);
				});
			}
		} else {
			compiler.hooks.emit.tap('SvgComponentGeneratorPlugin', (_stats) => {
				void this.svgCompGenertor.generate();
			});
		}
	}
}

export default WebpackSvgComponentPlugin;