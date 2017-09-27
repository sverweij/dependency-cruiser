import * as ReactDOM from 'react-dom';

export async function render(container: Element | null) {
    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container,
    );
};
