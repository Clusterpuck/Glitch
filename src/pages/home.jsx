import * as React from "react";
import { Link } from "wouter";
import Carousel from 'react-bootstrap/Carousel';


export default function Home() {
  
  return (
    <div>
    <head>
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></link>  
    </head>
    
    <body className="fullpage">
      <div>
          <div class="banner mainbanner"><h1 class="bannertext">Explore My Pages</h1></div>
        <div className="fullpage">
          <div className="pagecontent">
          
          <div className="gridpage">
            <Link href="/cwacalc">
              <img className="imageicon" src="https://cdn.glitch.global/48b686f6-ab7e-46d2-9a23-1714f5d7dcab/Calculator.png?v=1672709884872"></img>
              <div className="flexgrid">
                <h1 className="icontext">CWA Calculator</h1>
              </div>
            </Link>
          </div>
          
          
          <div className="gridpage">
            <Link href="/findrecipe">
              <img className="imageicon" src="https://cdn.glitch.global/48b686f6-ab7e-46d2-9a23-1714f5d7dcab/ramen.png?v=1672710297878"></img>
              <div className="flexgrid">
                <h1 className="icontext">Recipe Search</h1>
              </div>
            </Link>
          </div>
          
          
          
          
          </div>
        </div>
        
      
      </div>  
    </body>
    </div>
      
  );
}

//    <img src="https://spoonacular.com/recipeImages/716429-312x231.jpg"/>
//<img src="https://cdn.glitch.global/4ad257b6-19d0-4d35-a6b9-e72ddbded2e9/scientific-calculator-2130800-1798580.png?v=1668331687864" />