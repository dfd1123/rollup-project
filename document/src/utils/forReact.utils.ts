import {type ArgumentArray} from 'classnames';
import classNames from 'classnames/bind';
import {cn} from 'monkey-D/utils';

/**
 *
 * @description classNames.bind 함수로 만드는 cx 대신에 사용하는 함수이며, 고유 className과 글로벌로 사용 가능한 className을 같이 반환해준다.
 */
export const makeCxFunc = (style: Readonly<Record<string, string>>) => {
	const cx = classNames.bind(style);

	return (...args: ArgumentArray) => {
		return `${cx(args)} ${cn(args)}`;
	};
};