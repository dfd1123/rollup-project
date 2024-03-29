import chokidar from 'chokidar';
import SvgComponentGenerator from '../svgComponentGenerator';
class WebpackSvgComponentPlugin {
    constructor({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description }) {
        this.svgFileDir = svgFileDir;
        this.svgCompGenertor = new SvgComponentGenerator({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description });
    }
    apply(compiler) {
        compiler.hooks.emit.tap('SvgComponentGeneratorPlugin', (_stats) => {
            if (process.env.NODE_ENV === 'development') {
                const watcher = chokidar.watch(this.svgFileDir, { persistent: true, ignored: /\/svg\/types\// });
                watcher.on('add', this.svgCompGenertor.generate);
                watcher.on('unlink', this.svgCompGenertor.generate);
                process.on('SIGINT', function () {
                    void watcher.close();
                    process.exit(0);
                });
            }
            else {
                void this.svgCompGenertor.generate();
            }
        });
    }
}
export default WebpackSvgComponentPlugin;
//# sourceMappingURL=webpack-svg-component-plugin.js.map