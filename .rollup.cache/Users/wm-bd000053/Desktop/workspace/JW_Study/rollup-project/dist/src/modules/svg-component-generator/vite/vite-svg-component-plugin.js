import chokidar from 'chokidar';
import SvgComponentGenerator from '../svgComponentGenerator';
const viteSvgComponentPlugin = ({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description }) => {
    return {
        name: 'vite-svg-component-plugin',
        buildStart() {
            const svgCompGenertor = new SvgComponentGenerator({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description });
            if (process.env.NODE_ENV === 'development') {
                const watcher = chokidar.watch(svgFileDir, { persistent: true, ignored: /\/svg\/types\// });
                watcher.on('add', svgCompGenertor.generate);
                watcher.on('unlink', svgCompGenertor.generate);
                process.on('SIGINT', function () {
                    void watcher.close();
                    process.exit(0);
                });
            }
            else {
                void svgCompGenertor.generate();
            }
        },
    };
};
export default viteSvgComponentPlugin;
//# sourceMappingURL=vite-svg-component-plugin.js.map