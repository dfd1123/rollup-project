export type SvgComponentGeneratorOption = {
    svgFileDir: string;
    outputDir?: string;
    removeViewBox?: boolean;
    typescript?: boolean;
    useSvgr?: boolean;
    title?: boolean;
    description?: boolean;
};
/**
 * SvgComponentGenerator 클래스는 SVG 파일들을 React 컴포넌트로 변환합니다.
 * 이 클래스는 SVG 파일들이 저장된 디렉토리를 읽고, 각 SVG 파일을 React 컴포넌트로 변환하여
 * 지정된 출력 디렉토리에 저장합니다. TypeScript를 지원하며, 필요에 따라 SVGR을 사용할 수 있습니다.
 */
declare class SvgComponentGenerator {
    /**
   * SVG 파일들이 위치한 디렉토리 경로
   */
    private readonly svgFileDir;
    /**
   * TypeScript를 사용할지 여부
   */
    private readonly typescript;
    /**
   * 변환된 컴포넌트들이 저장될 출력 디렉토리 경로
   */
    private readonly outputDir;
    /**
   * SVG에서 viewBox를 제거할지 여부
   */
    private readonly removeViewBox;
    /**
   * SVGR을 사용할지 여부
   */
    private readonly useSvgr;
    /**
   * SVG Title 태그를 노출할지 여부
   */
    private readonly title;
    /**
   * SVG Desc 태그를 노출할지 여부
   */
    private readonly description;
    /**
   * SvgComponentGenerator 클래스의 생성자입니다.
   * @param {SvgComponentGeneratorOption} SVG 컴포넌트 생성 옵션 객체
   */
    constructor({ svgFileDir, outputDir, removeViewBox, typescript, useSvgr, title, description, }: SvgComponentGeneratorOption);
    /**
   * SVG 파일 리스트를 파싱하여 타입 정의를 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   * @returns 타입 정의 문자열
   */
    parseSvgListForType(list: string[]): {
        staticSvgIconName: string;
        particalSvgIconName: string;
        svgComponentName: string;
    };
    /**
   * SVG 파일 리스트를 파싱하여 파일 객체를 생성하고 React 컴포넌트 문자열을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   * @returns React 컴포넌트 문자열과 관련 정보
   */
    parseSvgListForFile(list: string[]): Promise<{
        importString: string;
        componentFuncsString: string;
        exportString: string;
    }>;
    /**
   * 주어진 파일 리스트에서 SVG 파일 이름만 필터링합니다.
   * @param {string[]} list 파일 이름 리스트
   * @returns SVG 파일 이름 리스트
   */
    filterSvgFileNameList(list: string[]): string[];
    /**
   * 지정된 디렉토리에서 SVG 파일 리스트를 읽습니다.
   * @param {string} dir SVG 파일이 위치한 디렉토리 경로
   * @param {string} [dirName=''] 현재 디렉토리 이름
   * @returns SVG 파일 경로 리스트
   */
    readSvgFileList: (dir: string, dirName?: string) => Promise<string[]>;
    /**
   * SVG 타입 파일을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   */
    writeSvgTypeFile(list: string[]): Promise<void>;
    /**
   * 정적 SVG export 파일을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   */
    writeStaticSvgExportFile(list: string[]): Promise<void>;
    generate: () => Promise<void>;
}
export default SvgComponentGenerator;
//# sourceMappingURL=svgComponentGenerator.d.ts.map