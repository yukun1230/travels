import * as React from 'react';
import { Provider } from 'react-redux';
import {store} from './src/redux/store';
import Index from './Index'

function App() {
    // redux仓库包裹
    return(
    <Provider store={store}>
        <Index/>
    </Provider>
    );
}

export default App