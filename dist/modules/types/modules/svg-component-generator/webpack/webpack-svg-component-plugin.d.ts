import { Config } from 'svgo';
import { SvgComponentGeneratorOption } from '../svgComponentGenerator';
type WebpackPluginOptions = SvgComponentGeneratorOption & {
    svgo?: Omit<Config, 'path'>;
};
type Compiler = {
    hooks: {
        emit: {
            tap: (name: string, callback: (stats: unknown) => void) => void;
        };
    };
    assets: any;
};
declare class WebpackSvgComponentPlugin {
    private readonly svgCompGenertor;
    private readonly svgFileDir;
    private watcher?;
    private svgo?;
    constructor({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description, svgo }: WebpackPluginOptions);
    apply(compiler: Compiler): Promise<void>;
}
export default WebpackSvgComponentPlugin;
