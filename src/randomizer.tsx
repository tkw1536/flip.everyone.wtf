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
        this.setState({ progress: 'finish', result: random(choices) });
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

/** random randomly chooses from choices */
export function random<T>(choices: Array<T>): T {
    const count = choices.length;
    
    // randomly determine index using crypto getRandomValues
    let index: number;
    if (crypto && crypto.getRandomValues) {
        const numBytes = Math.ceil(count/(1 << 8));
        const buffer = new Uint8Array(numBytes);

        do {
            crypto.getRandomValues(buffer);
    
            index = 0;
            buffer.forEach((b, i) =>
                index += b << i
            );
        } while(index >= count);
    
    // or falling back to Math.random()
    } else {
        index = Math.floor(Math.random()*count);
    }

    return choices[index];
}