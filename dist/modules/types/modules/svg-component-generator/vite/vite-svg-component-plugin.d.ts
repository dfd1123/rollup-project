import { Config } from 'svgo';
import { SvgComponentGeneratorOption } from '../svgComponentGenerator';
type VitePluginOptions = SvgComponentGeneratorOption & {
    svgo?: Omit<Config, 'path'>;
};
declare const viteSvgComponentPlugin: ({ svgFileDir, outputDir, removeViewBox, useSvgr, typescript, title, description, svgo }: VitePluginOptions) => {
    name: string;
    load(id: string): Promise<string | undefined>;
    buildStart(): void;
    buildEnd(): void;
};
export default viteSvgComponentPlugin;
