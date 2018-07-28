import * as React from 'react';

export interface HeaderProps {
    title: string;    
    message: string;
}

export class Header extends React.Component<HeaderProps, any> {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <section className='ms-welcome__header '>
                <h1 className='ms-fontSize-l ms-fontWeight-light ms-fontColor-neutralPrimary'>{this.props.message}</h1>
            </section>
        );
    };
};