import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import './libs/bulma.min.css';
import './App.css';
import Provider from './context/Provider';
import Login from './pages/Login';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Header from './components/Header';


class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Provider>
          <div className="is-justify-content-end">
            <Header />
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/relatorios" component={Reports} />
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
