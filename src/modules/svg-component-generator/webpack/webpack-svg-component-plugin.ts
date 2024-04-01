import chokidar from 'chokidar';
import SvgComponentGenerator, { SvgComponentGeneratorOption } from '../svgComponentGenerator';

type WebpackPluginOptions = SvgComponentGeneratorOption & {
	// types
};

type Compiler = {
	hooks: {
		emit: {
			tap: (name: string, callback: (stats: unknown) => void) => void;
		};
		done: {
			tap: (name: string, callback: (stats: unknown) => void) => void;
		};
	};
	assets: any;
};

class WebpackSvgComponentPlugin {
	private readonly svgCompGenertor: SvgComponentGenerator;
	private readonly svgFileDir: string;
	private watcher?: chokidar.FSWatcher;

	constructor({ svgFileDir, outputDir, useSvgr, typescript, title, description, svgo }: WebpackPluginOptions) {
		this.svgFileDir = svgFileDir;
		this.svgCompGenertor = new SvgComponentGenerator({ svgFileDir, outputDir, useSvgr, typescript, title, description, svgo });
	}

	async apply(compiler: Compiler) {
		compiler.hooks.emit.tap('SvgComponentGeneratorPlugin', (_stats) => {
			void this.svgCompGenertor.generate();
		});

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
		}
	}
}

export default WebpackSvgComponentPlugin;