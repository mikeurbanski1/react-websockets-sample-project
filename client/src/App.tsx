import React, { ReactNode, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css';

interface TheThingProps {
    text: string;
    sendMessage: (val: string) => void;
}

interface TheThingState {
    buttonValues?: string[];
}

type Message = {
    text: string;
};

class TheThing extends React.Component<TheThingProps, TheThingState> {
    constructor(props: TheThingProps) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        console.log('componentDidMount');
        axios
            .get('http://localhost:3001/buttons')
            .then((response: AxiosResponse) => {
                console.log(response);
                this.setState({
                    buttonValues: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    buttonClick(text: string): void {
        this.props.sendMessage(text);
    }

    render(): ReactNode {
        const buttons: JSX.Element[] = [];

        if (this.state.buttonValues) {
            for (let v of this.state.buttonValues) {
                buttons.push(<input type="button" value={v} key={v} onClick={() => this.buttonClick(v)}></input>);
            }
        }

        return (
            <div>
                <h1>{this.props.text || 'hi'}</h1>
                {buttons}
            </div>
        );
    }
}

function App() {
    const [buttonVal, setButtonVal] = useState<string>('Not ready');
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<Message>('ws://localhost:3002', {
        shouldReconnect: () => true
    });

    useEffect(() => {
        console.log('Connection state changed', readyState);
    }, [readyState, sendJsonMessage]);

    useEffect(() => {
        console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);
        if (lastJsonMessage) {
            setButtonVal(lastJsonMessage.text);
        }
    }, [lastJsonMessage]);

    return (
        <div className="App">
            <header className="App-header">
                <TheThing text={buttonVal} sendMessage={(val: string) => sendJsonMessage<Message>({ text: val })}></TheThing>
            </header>
        </div>
    );
}

export default App;

