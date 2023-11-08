import React, { Component } from 'react';
import chess from '../index/index.tsx';
import { Route, BrowserRouter } from 'react-router-dom';
export default class index extends Component {
    render () {
        return (
            <BrowserRouter>
                <Route component={chess} path='/' exact></Route>
            </BrowserRouter>
        );
    }
}
