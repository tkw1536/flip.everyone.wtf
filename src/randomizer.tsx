import * as React from "react";

interface RandomizerProps<T> {
    choices: Array<T>,
    auto?: boolean;
    delay?: number,

    onInit: (randomize: () => void) => React.ReactChild,
    onDelay: (randomize: () => void) => React.ReactChild,
    onFinish: (randomize: () => void, result: T) => React.ReactChild,
}

interface RandomizerState<T> {
    progress: 'init' | 'delay' | 'finish',
    result?: T,
}

export default class Randomizer<T> extends React.Component<RandomizerProps<T>, RandomizerState<T>> {
    state: RandomizerState<T> = {
        progress: 'init'
    }

    private timeout: NodeJS.Timeout | undefined = undefined;
    private readonly doRandomize = () => {
        const { delay } = this.props;
        if (this.timeout !== undefined) {
            window.clearTimeout(this.timeout);
        }

        this.setState({ progress: 'delay', result: undefined });
        this.timeout = setTimeout(this.didRandomize, delay ?? 300);
    }
    componentWillUnmount() {
        if (this.timeout === undefined) return;
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
    private readonly didRandomize = () => {
        const { choices } = this.props;
        this.timeout = undefined;
        const result = choices[Math.floor(Math.random()*choices.length)];
        this.setState({ progress: 'finish', result });
    }

    componentDidMount() {
        const { auto } = this.props;
        if (auto) {
            this.doRandomize();
        }
    }

    render() {
        const { onInit, onDelay, onFinish } = this.props;
        const { progress, result } = this.state;
        
        if (progress === 'init') {
            return onInit(this.doRandomize);
        }
        if (progress === 'delay') {
            return onDelay(this.doRandomize)
        }

        return onFinish(this.doRandomize, result);
    }
}
