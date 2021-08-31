import * as React from 'react';
import Head from 'next/head';
import style from './index.module.css';
import SRandomizer, { SRandomizerProps } from '../src/srandomizer';
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

interface Preset {
    url: string;
    title: string;
    text: string;
    props: SRandomizerProps<string>;
}

const PRESETS: Array<Preset> = [
    {
        url: '',
        title: 'Flip (a coin) for everyone',
        text: 'Coin',
        props: {
            choices: ['head', 'tail'],
            extraText: () => ({ text: "Click to flip" }),
            initText: () => ({ text: "Flipping", className: style.init }),
            delayText: () => ({ text: "Flipping", className: style.delay }),
            finishText: (result: string) => ({
                text: result === 'head' ? 'Heads' : 'Tails',
                className: style.finish
            }),
        }
    },
    {
        url: 'yesno',
        title: 'Decide for everyone',
        text: 'Yes / No',
        props: {
            choices: ['yes', 'no'],
            extraText: () => ({ text: "Click to decide" }),
            initText: () => ({ text: "Deciding", className: style.init }),
            delayText: () => ({ text: "Deciding", className: style.delay }),
            finishText: (result: string) => ({
                text: result === 'yes' ? 'Yes' : 'No',
                className: style[result]
            }),
        }
    },
    {
        url: 'compass',
        title: 'Orient everyone',
        text: 'Compass',
        props: {
            choices: ['north', 'east', 'south', 'west'],
            extraText: () => ({ text: "Click to orient" }),
            initText: () => ({ text: "Orienting", className: style.init }),
            delayText: () => ({ text: "Orienting", className: style.delay }),
            finishText: (result: string) => ({
                text: result === 'north' ? 'North' : result === 'east' ? 'East' : result === 'south' ? 'South' : 'West',
                className: style[result]
            }),
        }
    },
    {
        url: 'yes',
        title: 'Yes?',
        text: '',
        props: {
            auto: false,
            delay: 500,
            choices: ['yes'],
            extraText: () => ({ text: 'Click to decide', className: style.yes }),
            initText: () => ({ text: 'Yes?' }),
            delayText: () => ({ text: 'Yes?' }),
            finishText: (result: string) => ({ text: 'Yes', className: style.yes }),
        }
    },
    {
        url: 'no',
        title: 'No?',
        text: '',
        props: {
            auto: false,
            delay: 500,
            choices: ['no'],
            extraText: () => ({ text: 'Click to decide', className: style.no }),
            initText: () => ({ text: 'No?' }),
            delayText: () => ({ text: 'No?' }),
            finishText: (result: string) => ({ text: 'No', className: style.no }),
        }
    },
]

export default class extends React.Component<{ preset: string }> {
    render() {
        const { preset } = this.props;
        const { url, title, props } = PRESETS.find(({ url }) => url === preset);
        return <>
            <Head><title>{title}</title></Head>

            <header className={style.menu}>
                <Menu here={url} />
            </header>

            <div className={style.UI}>
                <SRandomizer auto {...props} />
            </div>
        </>;
    }
}

interface MenuProps {
    here: string;
}
class Menu extends React.Component<MenuProps> {
    render() {
        const { here } = this.props;
        return PRESETS.filter(({ text }) => text!='').map(({ text, url }) => (
            url === here ? <b key={url}>{text}</b> : <Link href={url === '' ? '/' : url} key={url}><a>{text}</a></Link>
        ));
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const presets = PRESETS.filter(({ url }) => url !== '').map(({ url }) => ({ params: { preset: url } }));
    return {
        paths: presets,
        fallback: false,
    };
}

export const getStaticProps: GetStaticProps = async (context) => {
    const preset = context.params!.preset as string;
    return {
        props: {
            preset: preset,
        }
    };
}
