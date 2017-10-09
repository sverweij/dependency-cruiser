import ReactDOM from 'react-dom';

export function render(container) {
    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container
    );
};
