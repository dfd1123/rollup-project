// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cn = (...args: Array<string | number | boolean | undefined | Record<string, any>>) => {
	const classNames = args.reduce<string>((acc, cur) => {
		if (typeof cur === 'string') {
			acc += ` ${cur}`;
		} else if (typeof cur === 'object') {
			acc += Object.entries(cur ?? {}).reduce((names, [key, value]) => {
				if (value) {
					names += ` ${key}`;
				}

				return names;
			}, '');
		}

		return acc;
	}, '');

	return classNames;
};
  