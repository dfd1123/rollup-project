import fs from 'fs';
import {Config, optimize} from 'svgo';
import chokidar from 'chokidar';
import SvgComponentGenerator, { SvgComponentGeneratorOption } from '../svgComponentGenerator';

type VitePluginOptions = SvgComponentGeneratorOption & {
	svgo?: Omit<Config, 'path'>
};

let watcher: chokidar.FSWatcher | null; // 전역 또는 모듈 수준의 변수로 watcher를 관리
const fileRegex = /\.svg$/;

const viteSvgComponentPlugin = ({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description, svgo }: VitePluginOptions) => {
	return {
		name: 'vite-svg-component-plugin',
		async load(id: string) {
			if (fileRegex.test(id) && svgo) {
			  let svgCode;
			  try {
				svgCode = await fs.promises.readFile(id, 'utf8');
			  } catch (exception) {
				console.warn(`${id} couldn't be loaded by vite-plugin-svgo: `, exception);
				return;
			  }
			  try {
				const optimizedSvg = optimize(svgCode, {
				  path: id,
				  ...svgo,
				});
				return `export default \`${optimizedSvg.data}\`;`;
			  } catch (exception) {
				console.error(`${id} errored during svg optimization: `, exception);
			  }
			}
		  },
		buildStart() {
			const svgCompGenertor = new SvgComponentGenerator({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description });

			if (process.env.NODE_ENV === 'development') {
				if (!watcher) { // watcher가 이미 존재하지 않는 경우에만 생성
					watcher = chokidar.watch(svgFileDir, { persistent: true, ignored: /\/svg\/types\// });

					watcher.on('add', svgCompGenertor.generate);
					watcher.on('unlink', svgCompGenertor.generate);
				}
			} else {
				void svgCompGenertor.generate();
			}
		},
		buildEnd() {
			if (watcher) { // 빌드가 끝나면 watcher를 닫기
				watcher.close();
				watcher = null; // watcher 참조를 제거
			}
		}
	};
};

// SIGINT 이벤트 리스너를 전역으로 한 번만 등록
process.once('SIGINT', function () {
	if (watcher) {
		void watcher.close();
	}
	process.exit(0);
});

export default viteSvgComponentPlugin;