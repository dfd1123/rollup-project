import path from 'path';
import { existsSync, promises } from 'fs';
import { startCase } from 'lodash-es';
import { SVG_ATTRIBUTE_KEYS } from './svgConst';
import { Config as SvgConfig, optimize } from 'svgo';

const { readdir, writeFile, readFile, mkdir } = promises;

export type SvgComponentGeneratorOption = {
	svgFileDir: string; 
	outputDir?: string;
	typescript?: boolean;
	useSvgr?: boolean;
	title?: boolean;
	description?: boolean;
	svgo?: Omit<SvgConfig, 'path'>;
};

let generating = false;

/**
 * SvgComponentGenerator 클래스는 SVG 파일들을 React 컴포넌트로 변환합니다.
 * 이 클래스는 SVG 파일들이 저장된 디렉토리를 읽고, 각 SVG 파일을 React 컴포넌트로 변환하여
 * 지정된 출력 디렉토리에 저장합니다. TypeScript를 지원하며, 필요에 따라 SVGR을 사용할 수 있습니다.
 */
class SvgComponentGenerator {
	/**
   * SVG 파일들이 위치한 디렉토리 경로
   */
	private readonly svgFileDir: string;
	/**
   * TypeScript를 사용할지 여부
   */
	private readonly typescript: boolean;
	/**
   * 변환된 컴포넌트들이 저장될 출력 디렉토리 경로
   */
	private readonly outputDir: string;
	/**
   * SVGR을 사용할지 여부
   */
	private readonly useSvgr: boolean;
	/**
   * SVG Title 태그를 노출할지 여부
   */
	private readonly title: boolean;
	/**
   * SVG Desc 태그를 노출할지 여부
   */
	private readonly description: boolean;
	private readonly svgo?: Omit<SvgConfig, 'path'>;
  
	/**
   * SvgComponentGenerator 클래스의 생성자입니다.
   * @param {SvgComponentGeneratorOption} SVG 컴포넌트 생성 옵션 객체
   */
	constructor({ 
		svgFileDir,
		outputDir,
		typescript = false, 
		useSvgr = false,
		title = false,
		description = false,
		svgo
	}: SvgComponentGeneratorOption) {
		this.svgFileDir = svgFileDir;
		this.outputDir = outputDir ?? svgFileDir;
		this.useSvgr = useSvgr;
		this.typescript = typescript;
		this.title = title;
		this.description = description;
		this.svgo = svgo;
	}

	/**
   * SVG 파일 리스트를 파싱하여 타입 정의를 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   * @returns 타입 정의 문자열
   */
	parseSvgListForType(list: string[]) {
		const fileList = list.map((file) => `${file.replace('.svg', '')}`);
  
		const staticSvgIconName = fileList.map(item => `'${item}'`).join(' | ');
		const svgComponentName = fileList.map(item => `'${`Svg${startCase(item.replace(/\//gi, '-').replace('.svg', '')).replace(/ /gi, '')}'`}`).join(' | ');
		const particalSvgObj = fileList.filter(item => item.includes('/')).reduce<Record<string, string>>((acc, cur) => {
			const arr = cur.split('/');
			const fileName = arr.pop();
  
			const directoryPascalName = startCase(arr.join('-')).replace(/ /gi, '');
  
			return {
				...acc,
				[directoryPascalName]: acc[directoryPascalName] ? `${acc[directoryPascalName]} | '${fileName}'` : `'${fileName}'`,
			};
		}, {});
  
		const particalSvgIconName = Object.entries(particalSvgObj).map(([key, value]) => `export type ${key}IconType = ${value};\n`).join('');
  
		return { staticSvgIconName, particalSvgIconName, svgComponentName };
	}

	/**
   * SVG 파일 리스트를 파싱하여 파일 객체를 생성하고 React 컴포넌트 문자열을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   * @returns React 컴포넌트 문자열과 관련 정보
   */
	async parseSvgListForFile(list: string[]) {
		const fileObject =  list.reduce<Record<string, string>>((acc, cur) => {
			const fileName = `Svg${startCase(cur.replace(/\//gi, '-').replace('.svg', '')).replace(/ /gi, '')}`;
			acc = {
				...acc,
				[fileName]: cur,
			};
  
			return acc;
		}, {});
		const fileList = Object.entries(fileObject);
		const relativePath = path.relative(this.outputDir, this.svgFileDir);
		const importString = fileList.reduce((acc, [key, value]) => acc += `import ${key} from '${relativePath}/${value}';\n`, '').replace(/\n/gi, '');

		let componentFuncsString = '';

		for (const [key, value] of fileList) {
			let data = await readFile(`${this.svgFileDir}/${value}`, 'utf8');

			if(this.svgo){
				const result = optimize(data, this.svgo)
				data = result.data;
			}

			const regex = /(<svg[^>]*)/;
			const replacement = '$1 {...props}';
			let svgElement = data.replace(/(\s[a-z]+[-:][a-z]+)(?==)/g, function (match, p1) {
				// p1은 매칭된 전체 문자열입니다.
				// 이제 -나 :을 기준으로 앞뒤 문자를 변환
				const resultAttr = (p1 as string).replace(/([a-z])[-:]([a-z])/g, function (_, p1, p2) {
					// 첫 번째 그룹과 두 번째 그룹을 연결하되, 두 번째 그룹의 첫 글자는 대문자로 변환
					return `${p1}${p2.toUpperCase()}`;
				});
				
				// 변환된 속성 이름이 SVG_ATTRIBUTE_KEYS 배열에 포함되어 있는지 확인
				// 이 부분은 원래 코드의 의도대로 유지
				if (SVG_ATTRIBUTE_KEYS.includes(resultAttr.trim())) {
					return resultAttr;
				}
			
				// 조건에 맞지 않으면 원래 매칭된 문자열 반환
				return match;
			}).replace('class="', 'className="').replace(regex, replacement);

			if (this.description) {
				svgElement = svgElement.replace(/(<svg[^>]*>)/g, '$1{!!props.description && <desc>{props.description}</desc>}');
			}

			if (this.title) {
				svgElement = svgElement.replace(/(<svg[^>]*>)/g, `$1<title>{props.title ?? '${key}'}</title>`);
			}

			const type = 'React.SVGAttributes<SVGSVGElement> & { title?: string; description?: string; }';

			componentFuncsString += `const ${key} = (props${this.typescript ? `: ${type}` : ''} = {}) => { return (${svgElement}); };\n`;
		}

		const exportString = fileList.reduce((acc, [key, _value], index) => {
			if (index === 0) acc = 'export {\n';
			acc += `${index !== 0 ? ',' : ''}  ${key}\n`;
			if (index === Object.entries(fileObject).length - 1) acc += ' };';
  
			return acc;
		}, '').replace(/\n/gi, '');
  
		return { importString, componentFuncsString, exportString };
	}

	/**
   * 주어진 파일 리스트에서 SVG 파일 이름만 필터링합니다.
   * @param {string[]} list 파일 이름 리스트
   * @returns SVG 파일 이름 리스트
   */
	filterSvgFileNameList(list: string[]) {
		return list
			.filter((name) => name.endsWith('.svg'));
	}


	/**
   * 지정된 디렉토리에서 SVG 파일 리스트를 읽습니다.
   * @param {string} dir SVG 파일이 위치한 디렉토리 경로
   * @param {string} [dirName=''] 현재 디렉토리 이름
   * @returns SVG 파일 경로 리스트
   */
	readSvgFileList = async (dir: string, dirName = ''): Promise<string[]> => {
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(
			dirents.map(async (dirent) => {
				const newDirName = `${dirName ? `${dirName}/` : ''}${dirent.name}`;
				const res = path.resolve(dir, dirent.name);
				return dirent.isDirectory() && dirent.name !== 'types'
					? this.readSvgFileList(res, newDirName)
					: newDirName;
			}),
		);
		const concatList = Array.prototype.concat(...files) as string[];
  
		return concatList;
	};

	/**
   * SVG 타입 파일을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   */
	async writeSvgTypeFile(list: string[]) {
		if (!this.typescript) return;

		const { staticSvgIconName, particalSvgIconName, svgComponentName } = this.parseSvgListForType(list);

		const typeDir = `${this.outputDir}/types`;

		await mkdir(typeDir, { recursive: true });
  
		if (existsSync(typeDir)) {
			return writeFile(
				`${typeDir}/index.d.ts`,
				`/* eslint-disable */\nexport type StaticSvgIconName = ${staticSvgIconName};\n${particalSvgIconName}`
        + `export type SvgComponentName = ${svgComponentName}`,
				{ flag: 'w' },
			)
				.then(() => {
					console.log('✨[Static Svg Type File] is Generated!'); 
				})
				.catch(console.error);
		}

		
	}

	/**
   * 정적 SVG export 파일을 생성합니다.
   * @param {string[]} list SVG 파일 이름 리스트
   */
	async writeStaticSvgExportFile(list: string[]) {
		const { componentFuncsString, importString, exportString } = await this.parseSvgListForFile(list);

		await mkdir(this.outputDir, { recursive: true });
  
		return writeFile(
			`${this.outputDir}/index.${this.typescript ? 'tsx' : 'jsx'}`,
			`/* eslint-disable */ \nimport React from "react";\n\n${this.useSvgr ? importString : componentFuncsString}\n${exportString}`,
			{ flag: 'w' },
		)
			.then(() => {
				console.log('✨[Static Svg Export File] is Generated!'); 
			})
			.catch(console.error);
	}

	generate = async () => {
		if (generating) return;

		try {
			generating = true;

			const fileNameList = await this.readSvgFileList(this.svgFileDir);
			const svgFileList = this.filterSvgFileNameList(fileNameList);
      
			await this.writeSvgTypeFile(svgFileList);
			await this.writeStaticSvgExportFile(svgFileList);
		} finally {
			setTimeout(() => {
				generating = false;
			}, 1500);
			
		}
   
	};
}


export default SvgComponentGenerator;