import * as React from "react";
import { Switch, Route, Router } from "wouter";
import Home from "../pages/home";
import About from "../pages/about";
import Recipe from "../pages/findrecipe";
import CWA from "../pages/cwacalc";
import test from "../pages/frametest";


export default () => (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} /> 
      <Route path="/findrecipe" component={Recipe} />
      <Route path="/cwacalc" component={CWA} />
      <Route path="/frametest" component={test} />
    </Switch>
);
