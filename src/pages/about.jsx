import * as React from "react";
import { Link } from "wouter";

export default function About() {

  
  return (
    <div className="fullpage">
      <div className="banner keybanner">
        <h1 className="bannertext">
          About Nick Wright {" "}
          <a href="https://www.linkedin.com/in/nicholas-g-wright/" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              version="1.1"
              viewBox="0 0 473.931 473.931"
              xmlSpace="preserve"
            >
              <circle cx="236.966" cy="236.966" r="236.966" fill="#4A86C5"></circle>
              <path
                fill="#3D80B2"
                d="M404.518 69.383c92.541 92.549 92.549 242.59 0 335.138-92.541 92.541-242.593 92.541-335.134 0L404.518 69.383z"
              ></path>
              <path
                fill="#4A86C5"
                d="M462.646 309.275c.868-2.713 1.658-5.456 2.432-8.206a279.414 279.414 0 01-2.432 8.206z"
              ></path>
              <g fill="#377CA5">
                <path d="M465.097 301.017L465.097 301.017 465.082 301.07z"></path>
                <path d="M465.097 301.017L336.721 172.641l-29.204 29.204-20.303-20.303-16.946 16.946-99.236-99.238-6.155-2.346-38.08 38.08 45.968 45.964-44.998 44.995 43.943 43.943-48.048 48.052L276.475 470.59c87.984-14.78 159.5-77.993 186.175-161.311a295.249 295.249 0 002.432-8.206.15.15 0 01.015-.056z"></path>
              </g>
              <path
                fill="#FFF"
                d="M358.565 230.459v87.883h-50.944v-81.997c0-20.595-7.375-34.656-25.811-34.656-14.084 0-22.458 9.474-26.147 18.634-1.343 3.278-1.688 7.835-1.688 12.423v85.593H203.02s.681-138.875 0-153.259h50.952v21.72c-.094.161-.236.34-.329.498h.329v-.498c6.769-10.425 18.862-25.324 45.923-25.324 33.537.003 58.67 21.908 58.67 68.983zM149.7 91.198c-17.429 0-28.838 11.439-28.838 26.473 0 14.716 11.072 26.495 28.164 26.495h.344c17.766 0 28.823-11.779 28.823-26.495-.336-15.035-11.056-26.473-28.493-26.473zm-25.814 227.143h50.944V165.083h-50.944v153.258z"
              ></path>
            </svg>
        </a>
        </h1></div>
      <div className="textpage">
      
      <br></br>
        
      <p>
        I'm currently a <strong>software engineering student</strong> at Curtin university and I'm using these pages to show my journey of learning as many tehchnical skills as I can.
      </p>
        
        My passions include:
      <ul>
        <li> &#x1F30E; Sustainability</li>
        <li> &#x1F6B4; Mountain Biking</li>
        <li> &#x1F3B2; Table Top Gaming</li>
        <li> &#x1F393; Interactive Education</li>
      </ul>
      If you'd like to learn more you can follow and get in touch with my through my <a href="https://www.linkedin.com/in/nicholas-g-wright/" target="_blank" rel="noopener noreferrer">LinkedIn Page</a>
      <br></br><br></br>
      <h5>About the pages here</h5>
      <ul>
        <Link href="/cwacalc">
          <li className="linktext">
            <b>CWA Calculator</b>  was my first exposure to using any React, as well as any CSS, HTML and Javascript. The goal here was to create something I felt I would find useful while learning a new skill. 
          </li>
        </Link>
        <Link href="/findrecipe">
          <li className="linktext">
            <b>Find Recipe</b> was my first attempt at interacting with an API. After what I learnt from my CWA Calc page I applied this with the added challenge of using asynchronise functions
          </li>
        </Link>
          <li>
            <b>Future Plans</b> is to next make a page that can easily calculate the final score for a table top game, replacing the awkward moment of pulling out phones as calulcators at the end. 
            The added challenge I hope to give myself is to add database interactions so players can choose to build a history of past scores. 
          </li>
      </ul>

      <p>
        These pages were made using <a href="https://glitch.com/">Glitch</a> which I've found very useful as getting the sites online is very simple, so it's easy to motivate myself as something useful can easily be made. 
      </p>
      <p>
        Built with <a href="https://reactjs.org/">React</a> and{" "}
        <a href="https://vitejs.dev/">Vite</a> on{" "}
        <a href="https://glitch.com/">Glitch</a>.
      </p>
      </div>
      

    </div>
  );
}
