import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import{ConnectedRouter} from 'connected-react-router';
import * as serviceWorker from './serviceWorker';

import store, {history} from './store';
import './index.css';
import App from './components/App';
import Console from './components/Console';

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Console />
        </ConnectedRouter>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();