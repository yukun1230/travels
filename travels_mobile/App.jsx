import * as React from 'react';
import { Provider } from 'react-redux';
// import store from './src/store/DataCentre'
import {store} from './src/redux/store';
import Index from './Index'

function App(){
    return(
    <Provider store={store}>
        <Index/>
    </Provider>
    );
}

export default App