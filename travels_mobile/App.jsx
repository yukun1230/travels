import * as React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import Index from './Index'
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
    // redux仓库包裹
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <Index />
            </Provider>
        </GestureHandlerRootView>
    );
}

export default App