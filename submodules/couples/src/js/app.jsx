import { createStore, combineReducers } from 'redux';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import CouplesGame from './couplesGame.jsx';
import reducer from './reducers';
import { startGame, createCards } from './actions';

let appStore = createStore(reducer);

export default class App extends Component {
    render() {
        return (
            <div className="site-wrapper-inner">
                <div className="cover-container">
                    <CouplesGame store={appStore}/>
               </div>
            </div>
        );
    }
}

const renderApp = () => {
    render(<App/>, document.getElementById('root'));
};
renderApp();
appStore.subscribe(renderApp);

appStore.dispatch(createCards('tourism'));

setTimeout(() => {
    appStore.dispatch(startGame());
}, 3000);
