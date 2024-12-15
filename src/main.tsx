import { createRoot } from 'react-dom/client';
import HomePage from './pages/home';
import './index.css';
import { Provider } from 'react-redux'
import store from './Redux/store';


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <HomePage />

    </Provider>
);
