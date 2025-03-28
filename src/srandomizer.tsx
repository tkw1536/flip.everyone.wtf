import * as React from 'react';
import Randomizer from "./randomizer";

export interface ClassAndText {
    className?: string;
    text: string;
}

export interface SRandomizerProps<T extends string> {
    choices: Array<T>,
    auto?: boolean;
    delay?: number,

    extraText: () => ClassAndText,
    initText: () => ClassAndText,
    delayText: () => ClassAndText,
    finishText: (result: T) => ClassAndText,
}

export default class SRandomizer<T extends string> extends React.Component<SRandomizerProps<T>> {
    private readonly renderAlways = (randomize: () => void, child: React.ReactNode) => {
        const { className, text } = this.props.extraText();
        return <div onClick={randomize}>
            {child}
            <h2 className={className}>{text}</h2>
        </div>;
    }
    private readonly onInit = (randomize: () => void) => {
        const { className, text } = this.props.initText();
        return this.renderAlways(randomize, <h1 className={className}>{text}</h1>);
    }
    private readonly onDelay = (randomize: () => void) => {
        const { className, text } = this.props.delayText();
        return this.renderAlways(randomize, <h1 className={className}>{text}</h1>);
    }
    private readonly onFinish = (randomize: () => void, result: T) => {
        const { className, text } = this.props.finishText(result);
        return this.renderAlways(randomize, <h1 className={className}>{text}</h1>);
    }
    render() {
        const { choices, auto, delay} = this.props;
        return <Randomizer
            choices={choices} auto={auto} delay={delay}
            onInit={this.onInit} onDelay={this.onDelay} onFinish={this.onFinish}
        />;
    }
}