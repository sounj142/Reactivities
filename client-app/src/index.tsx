import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './app/layouts/styles.css';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './app/layouts/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './stores/store';
import { history } from './utils/route';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
