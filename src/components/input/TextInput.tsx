import React from 'react';
import styled from '@emotion/styled';

export type PropsType = {
	className?: string;
};

const TextInputComp = ({ className }: PropsType) => {

	return (
		<div className={className}>TextInput</div>
	);
};

const TextInput = styled(TextInputComp)`
    color: red;
`;

export default TextInput;
