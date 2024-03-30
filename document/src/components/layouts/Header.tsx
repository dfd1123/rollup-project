'use client';

import React from 'react';
import style from './styles/Header.module.scss';
import { makeCxFunc } from '@/utils/forReact.utils';
import Image from 'next/image';
import Link from 'next/link';
import { SvgIcoSearch } from '@/components/common/svg';

export type PropsType = {
	className?: string;
};

const cx = makeCxFunc(style);

const Header = ({ className }: PropsType) => {
	//logic

	return (
		<header className={cx(className, 'header')}>
			<div className={cx('header-cont')}>
				<Link className={cx('logo')} href="/">
					<span>
						<Image src="/imgs/MonkeyD_Symbol.png" alt="Monkey-DK-Symbol" width={48} height={47} />
						<Image src="/imgs/MonkeyD_Text.png" alt="Monkey-DK" width={128} height={20} />	
					</span>
				</Link>
				<nav>
					<SvgIcoSearch width={30} height={30} />
				</nav>
				<div className={cx('support-menu')}>

				</div>
			</div>
		</header>
	);
};

export default Header;