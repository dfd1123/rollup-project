import { SvgComponentGeneratorOption } from '../svgComponentGenerator';
type WebpackPluginOptions = SvgComponentGeneratorOption & {};
type Compiler = {
    hooks: {
        emit: {
            tap: (name: string, callback: (stats: unknown) => void) => void;
        };
    };
};
declare class WebpackSvgComponentPlugin {
    private readonly svgCompGenertor;
    private readonly svgFileDir;
    constructor({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description }: WebpackPluginOptions);
    apply(compiler: Compiler): void;
}
export default WebpackSvgComponentPlugin;
