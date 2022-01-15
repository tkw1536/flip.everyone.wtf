import * as React from 'react';
import {default as NextApp} from "next/app";

import '../src/globals.css';

export default class App extends NextApp {
    render() {
        const { Component, pageProps } = this.props;
        return <>
            <Component {...pageProps} />
            <footer>
                <ClientSideScript src='https://inform.everyone.wtf/legal.min.js' data-site-id={process.env.NEXT_ENV_PUBLIC_TRACKING_ID} />
            </footer>
        </>
    }
}

interface ScriptBasedContentProps {
  src: string;
  [key: string]: string;
}

/**
 * ClientSideScript ensures that a script is only run client-side.
 * Performs no property escaping what-so-ever, and should only be run on trusted data!
 * 
 * It runs inside of a <p> Element.
 */
class ClientSideScript extends React.Component<ScriptBasedContentProps> {
  static asHTML(props: ScriptBasedContentProps) {
    const attributes = Object.entries(props)
      .filter(([_, value]) => typeof value === 'string')
      .map(([key, value]) => key + '="' + value + '"').join(" ")
    return '<script ' + attributes + '></script>'
  }
  render() {
    // See https://github.com/facebook/react/issues/10923#issuecomment-338715787
    // We are setting the content via dangerouslySetInnerHTML to prevent client-side overrides!
    const __html = ClientSideScript.asHTML(this.props);
    return <p dangerouslySetInnerHTML={{__html}}></p>
  }
}