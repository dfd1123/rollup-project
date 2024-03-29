import { SvgComponentGeneratorOption } from '../svgComponentGenerator';
type VitePluginOptions = SvgComponentGeneratorOption & {};
declare const viteSvgComponentPlugin: ({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description }: VitePluginOptions) => {
    name: string;
    buildStart(): void;
};
export default viteSvgComponentPlugin;
