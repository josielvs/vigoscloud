import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Provider from './context/Provider';
import Login from './pages/Login';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Header from './components/Header';
import Burger from './components/Burguer';
import Config from './pages/Config';
import CallCenter from './pages/Callcenter'
import CreateEndpoints from './components/Config/Endpoints/EndpointsCreate';
import ListEndpoints from './components/Config/Endpoints/EndpointsList';
import ListEndpointsById from './components/Config/Endpoints/EndpointsListById';
import CreateTrunks from './components/Config/Trunks/TrunksCreate';
import ListTrunks from './components/Config/Trunks/TrunksList';
import ListTrunksById from './components/Config/Trunks/TrunksListById';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Provider>
          <div className="is-justify-content-end">
            <Header />
            <Burger />
            <Route exact path="/" component={ Login } />
            <Route exact path="/home" component={ Home } />
            <Route exact path="/relatorios" component={ Reports } />
            <Route exact path="/callcenter" component={ CallCenter } />
            <Route exact path="/config" component={ Config } />
            <Route exact path="/config/ramal/novo" component={ CreateEndpoints } />
            <Route exact path="/config/ramal/lista" component={ ListEndpoints } />
            <Route exact path="/config/ramal/id" component={ ListEndpointsById } />
            <Route exact path="/config/tronco/novo" component={ CreateTrunks } />
            <Route exact path="/config/tronco/lista" component={ ListTrunks } />
            <Route exact path="/config/tronco/id" component={ ListTrunksById } />
          </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
