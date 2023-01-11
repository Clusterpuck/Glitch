//Standard React Components
import * as React from "react";
import { useEffect, useState } from "react";

//Data source imports
import filters from "../data/filters.json";

//Style sheet import
import LocalStyle from "../styles/styles.css";
import 'react-bootstrap-typeahead/css/Typeahead.css';

//Form-interactive React component imports
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Typeahead } from "react-bootstrap-typeahead";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

//Visual React Components
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ListGroup from 'react-bootstrap/ListGroup';



/*Constants*/
//------------------------------------------------------------------------------------------------------------//
//Number of recipe results to show in search
const NUM_RESULTS = 10;

//TO-DO---------------------------------------------------------------------------------------------------//
//Need to move this to env file, get process not defined when called here
//This will involve me changing all my API request to a server side section then reference the results. TBA
const API_KEY = "apiKey=c1c7bd93d67a4ac98fd6346c6a3ce1d2";
const API_ENDPOINT = "https://api.spoonacular.com/";
const AUTOCOMPLETE_URI = API_ENDPOINT + "food/ingredients/autocomplete?number="+ NUM_RESULTS + "&" + API_KEY;
const RECIPE_URI = API_ENDPOINT + "recipes/";
const SEARCH_URI = API_ENDPOINT + "recipes/complexSearch?" + API_KEY;

//------------------------------------------------------------------------------------------------------------//
/*Functions to create URL API request strings*/

/* Functions to generate strings that search the api
  Often usede in combination to generate a long string for one request*/

function addAutoComplete(searchStr) 
{
    var filtStr = AUTOCOMPLETE_URI + "&query=" + searchStr;
    return filtStr;
}

/* Get requests for the API*/

//Gets the visual card of the recipe chosen
function apiReqCard(id) 
{
    var filtStr = RECIPE_URI + id + "/card?" + API_KEY;
    return filtStr;
}


//Gets the full instructions of the chosen recipe
function apiReqInstruction(id)
{
    var filtStr = RECIPE_URI + id + "/analyzedInstructions?" + API_KEY;
    return filtStr;
}


//Gets the list of ingredients in the chosen recipe
function apiReqIngredients(id)
{
    var filtStr = RECIPE_URI + id + "/information?includeNutrition=false&" + API_KEY;
    return filtStr;
}


//Request that includes all the ingredients in the list of the array
function apiIngredientList( apiString, ingredientList )
{
    const listSize = ingredientList.length;
    if( listSize > 0 )
    {
      apiString += "&includeIngredients=";
      for( var i = 0; i < listSize-1; i++ )
      {
        apiString += ingredientList[i] + ",";
      }
      apiString += ingredientList[listSize-1];
      apiString += "&sort=max-used-ingredients&number=5";
      console.log( "After apiIngList req is " + apiString);
    }
    return apiString;
}


//Search api based on a query word
function apiQuerySearch( apiStr, query )
{
  if( query !== "" && query != null)
    {
      apiStr += "&query=" + query;
    }
  return apiStr;
  
}


//------------------------------------------------------------------------------------------------------------//


//Main page to wrap and export all components
export default function RecipeSearchForm() 
{
  return (
    <div>
    <head>
        <meta charset="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>  
        <link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></link>
        <link rel="stylesheet" href={LocalStyle}></link>
    </head>
      
    <body>
      <div className="banner recipebanner"><h1 className="bannertext">Find Your Recipes</h1></div>
      
      <div>
        <FindRecipe />
      </div>
    </body>
    </div>
  );
}


//------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------//
//Collates the majority of the api calls that can be sent on to display
class FindRecipe extends React.Component 
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      //Async and status variables
      isLoading: false,
      error: null,
      joke: null,
      
      //Search results lists
      searchRes: [],
      searchAllergen: [],
      ingredientList: [],
      recipes: [],
      
      //Search filter selections
      diet: null,
      cuisine: null,
      type: null,
      intolerance: null,
      query: null,
      searchIng: true
    };
    
    this.addIngredient = this.addIngredient.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
    this.getJoke = this.getJoke.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
  }
  
  
  //Gets a joke text to fill the empty space before a search is completed
  getJoke()
  {
    this.setState({ isLoading: true });
    fetch( "https://api.spoonacular.com/food/jokes/random?" + API_KEY )
              .then(resp => resp.json() )
              .then( json => { this.setState({ joke: json.text,
                                               isLoading: false });
                                console.log(this.state.joke) 
                             } )
  }

  //Removes a selected ingredient from the ingredient list, given an index value
  removeIngredient( index )
  {
    console.log( "Index is " + Number(index));
    var newList = this.state.ingredientList;
    newList.splice(index, 1);
    this.setState({ ingredientList: newList });
  }
  
  
  //Adds an ingredient to the list, if that ingredient is not already in list
  addIngredient( selected )
  {
    if( selected.length > 0 )
    {
      console.log( "Adding ingredient " + selected[0].name );
      if( !this.state.ingredientList.includes( selected[0].name ) )
      {
        this.setState({
          ingredientList: [...this.state.ingredientList, selected[0].name ]
        })
      }
    }
  }
  
  
  
  //Builds a string based on the current options selected and sends request to API
  //For recipes matching that requirement
  //Search is done based on either a key word or list of ingredients
  //Trying to include both proved to be unhelpful from API experiments
  getRecipes()
  {
    //Building the string
    var apiStr =  SEARCH_URI;
    if( this.state.searchIng )
    {
      apiStr = apiIngredientList( apiStr, this.state.ingredientList);
    }
    else
    {
      apiStr = apiQuerySearch( apiStr, this.state.query );
    }
    if( this.state.diet !== "" && this.state.diet !== null && this.state.diet != "No Limits")
    {
      apiStr += "&diet=" + this.state.diet;
    }
    if( this.state.cuisine !== "" && this.state.cuisine != null)
    {
      apiStr += "&cuisine=" + this.state.cuisine;
    }
    if( this.state.type !== "" && this.state.type != null)
    {
      apiStr += "&type=" + this.state.type;
    }
    if( this.state.intolerance !== "" && this.state.intolerance != null )
    {
      apiStr += "&intolerances=" + this.state.intolerance;
    }
    
    //Making the api request, saved to recipes var in state
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res=> res.json())
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            recipes: result.results
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            error
          });
        }
      )
  }
  
  
  
//Get Recipe needs to be separated out to have a list of recipes separet from the recipe details. 
  //This is done now with shwo recipe details. This is best called from the main render to make it easier to separate components.
  render() 
  {
    if( this.state.joke === null & !this.state.isLoading )
    {
      //this.getJoke();
    }
      const space = "  ";
      const errorMsg = ["Api requests depleted"];
      return(
        
        <div className="flexmummy">
          
            <div className="flexbabysmall">
              
              <div className="radiobutton">
              
                <ButtonGroup aria-label="SearchType" >
          {/* Provides option to choose between searching by a key word or by a list of ingredients */}        
                  <Button variant="info" onClick={ ()=>this.setState({searchIng: true})}>
                    Ingredients
                  </Button>
                  
                  <Button variant="info" onClick={ ()=>this.setState({searchIng: false})}>
                    Key Word
                  </Button>
                </ButtonGroup>
                
              </div>
          {/*Search box changes based on chosen search style, either the async search with the API or any key word*/}
              <div className="label">
                <h1 className="labeltext">{ this.state.searchIng ? "Ingredient" : "Key Word" }</h1>
              </div>
              
              { this.state.searchIng ? 
              
              <ErrorBoundary>
                <AsyncTypeahead
                    isLoading={this.state.isLoading}
                    //disabled= {this.state.error !== null}
                    labelKey="name"
                    id="Ingredients"
                    placeholder="Add ingredients"
                    clearButton="{true}"
                    emptyLabel="The cupboard is bare"
                    onInputChange={ (query) => { 
                                            this.setState({ isLoading: true });
                                            fetch( addAutoComplete( query ) )
                                              .then(resp => resp.json() )
                                              .then(json => this.setState({
                                                isLoading: false,
                                                searchRes: json
                                            },
                                            (error) => {
                                                this.setState({
                                                isLoading: false,
                                                error});
                                            }))
                                          } 
                             }
                    options={ this.state.searchRes }
                    onChange={ (selected) => {this.addIngredient(selected)}}
                    renderMenuItemChildren={(option) => (<span>{option.name}</span>)}
                    promptText="Start typing an ingredient"
                    searchText="Looking in the pantry"
                    filterBy={() => true}
                  />
                </ErrorBoundary>
              :
              
        /*Ternary operator second option for key word search*/  
              <InputGroup>
                <Form.Control
                  placeholder="Type Here"
                  ref="input"
                  value={this.state.query}
                  clearButton="true"
                  onChange={ (selected) => this.setState({ query: selected.target.value })}
                  />
                
              </InputGroup>
              }
            
              
              <div class="label">
                <h1 className="labeltext">Dietary Limitations</h1>
              </div>
        {/*Search option of json object from the known possible dietary options in the API*/}      
                <Typeahead
                  id="dietary"
                  placeholder="Dietary Options"
                  clearButton="true"
                  options={filters.dietary}
                  onChange={ (selected) => this.setState({ diet: selected })}
                  selected={this.state.diet}
                />
              <div class="label">
                <h1 className="labeltext">Cuisine Selection</h1>
              </div>
            {/* Search option for the cuisine options, similarly using json object*/}
                  <Typeahead
                  id="cuisine"
                  placeholder="Cuisine Options"
                  clearButton="true"
                  options={filters.cuisine}
                  onChange={ (selected) => this.setState({ cuisine: selected })}
                  selected={this.state.cuisine}
                />
              
              <div class="label">
                <h1 className="labeltext">Recipe Type</h1>
              </div>
            {/* Search options for the known recipe types*/}
                  <Typeahead
                  id="type"
                  placeholder="Type Options"
                  clearButton="true"
                  dropup="true"
                  options={filters.type}
                  onChange={ (selected) => this.setState({ type: selected })}
                  selected={this.state.type}
                />
              
              <div class="label">
                  <h1 className="labeltext">Intolerance Selection</h1>
              </div>
              {/* Search options for the known intolerances*/}
                <Typeahead
                  id="intolerance"
                  placeholder="Intolerance Options"
                  clearButton="true"
                  dropup="true"
                  options={filters.intolerances}
                  onChange={(selected) => this.setState({ intolerance: selected })}
                  selected={this.state.intolerance}
                />
              
                    {    
                    this.state.searchIng && this.state.ingredientList.map(( ingredient, index ) => (
                          
                            <div>
          {/*Provides a cross badge for removing certain ingredients from the list*/}
                              <h4><span class="badge badge-info">
                                <svg 
                                    onClick={ event => this.removeIngredient(index) }
                                    xmlns="http://www.w3.org/2000/svg" 
                                    cursor="pointer"
                                    width="16" 
                                    height="16" 
                                    color="red"
                                    fill="currentColor" 
                                    class="bi bi-x-circle-fill" 
                                    viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>                            
                                  </svg>                  
                              {space}{ingredient}</span></h4>
                            </div>
                            
                      ))
                    }
              
              
                
                
                <div className="fullwidth">
              { /*Provides info on the search action about to be performed as a hover message*/
                  <OverlayTrigger
                    placement="right"
                    overlay={
                              <Tooltip id="Recipe">
                                {this.state.searchIng ? this.state.ingredientList.length + " ingredients to search" : "Search " + this.state.query}
                              </Tooltip>}
                  >
              {/*Button to activate search query to get recipe results*/}
                  <Button 
                    variant="primary" 
                    disabled= { this.state.isLoading} 
                    onClick={ this.getRecipes }
                  >
                      { this.state.isLoading ? "Loading..." : "Search Recipes" }
                  </Button>
                  </OverlayTrigger>
                }
                </div>
              
              </div>
              {/*Loads next component that displays the search results and able to load more detail from api
                 Send props of the recipe results from the search and the joke loaded to fill the text space*/}
              <ErrorBoundary>
              <GetRecipe 
                recipes={this.state.recipes}
                joke={this.state.joke}
              />
              </ErrorBoundary>     
        </div>
        
            );
    
  }  
}



//------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------//
//Used to display all the recipe options selected and then call more details as requested

class GetRecipe extends React.Component
{
  constructor(props) 
  {
    super(props);
    this.state = 
    {
      //Async and error variables
      isLoading: false,
      error: null,
      
      //Recipe details variables
      recipeCard: null,
      recipeId: 0,
      instructions: null,
      ingredients: null,
      
      //String used to request more recipe details
      apiStr: ""
    };
    this.setRecipeCard = this.setRecipeCard.bind(this);
    this.apiRecipeInstructions = this.apiRecipeInstructions.bind(this);
    this.apiRecipeIngredients = this.apiRecipeIngredients.bind(this);
  }
  
  //Utilises function to request string for the api request then sends request
  //This is one part of a string of asynchronise functions using .then
  //So isloading is not set to false in this function
  setRecipeCard(index, event)
  {
    var id = this.props.recipes[index].id;
    var apiStr = apiReqCard( id );
    console.log( "Card request is " + apiStr);
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res=> res.json())
      .then(
        (result) => {
          this.setState({
            recipeCard: result.url
          })
        },
        (error) => {
          this.setState({
            error
          });
        }
      ).then( this.apiRecipeInstructions( index, event ) );
  }
  
  //Second part of string of api requests, uses function to generate the string
  //Then sends api request to then load next function in line
  //Therefore does not set isLoading to false, instead calls the next function in .then
  apiRecipeInstructions( index, event )
  {
    var id = this.props.recipes[index].id;
    var apiStr = apiReqInstruction( id );
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res => res.json())
      .then(
        (result) => {
          this.setState({
            instructions: result,
            recipeId: id
          });
        },
        (error) => {
          this.setState({
            error
          });
        }
      ).then( this.apiRecipeIngredients( index, event ) );
    
  }
  
  //Final api requestion in series, as other uses relevant function to generate string
  //Then performs the api request but noe sets isLoading to false
  apiRecipeIngredients( index, event )
  {
    var id = this.props.recipes[index].id;
    var apiStr = apiReqIngredients( id );
    console.log( "Instructions Request " + apiStr);
    this.setState({ isLoading: true });
    fetch( apiStr )
      .then( res=> res.json())
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            ingredients: result
          });
        },
        (error) => {
          this.setState({
            isLoading: false,
            error
          });
        }
      )
  }
  
    //This render displays all the recipe results if there were any, otherwise displays a joke
    //Clicking any the list items loads the series of api request to show more details
    //This is then sent as props to display the recipe in the next component
    render()
    {
      if( this.props.recipes.length === 0 )
      {
        return( 
                  <div className="flexbabybig"><h4>{this.props.joke}</h4></div>
              )
      }
      else
      {
        return(
          <>
          <div className="flexbabysmall">
            
            {/*Display the recipe results as a ListGroup */}
            
                  <ListGroup>
                {
                  this.props.recipes.map(( recipe, index ) => (
                    <div className="listitem">
                    <ListGroup.Item eventKey={index}
                      action onClick={ event => this.setRecipeCard(index, event) }
                      disabled={this.state.isLoading}
                    >
                      <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="Recipe">Show this recipe</Tooltip>}
                  >
                      <div className="listtext">{recipe.title}</div>
                      </OverlayTrigger>
                    </ListGroup.Item>
                    </div>
                    
                  ))
                }
                  </ListGroup>  
            
            </div>   
            <div className="flexbabybig">
            
              
            {
                this.state.error === null && this.state.instructions !== null && this.state.ingredients !== null && 
                  <ShowRecipeDetails 
                    instructions={this.state.instructions}
                    card={this.state.recipeCard}
                    id={this.state.recipeId}
                    ingredients={this.state.ingredients}
                    loading={this.state.isLoading}
                  />
            }
            </div>
            
            </>
            
            
          

        )
      }
    }
  
    
}


//------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------//
//Fully displays all the details once a recipe has been chosen using props sent to component

class ShowRecipeDetails extends React.Component
{
  constructor(props) 
  {
    super(props);
  }  
  
  
  render()
  {
    
    return(
      
      this.props.loading ? "Loading Please Wait" : 
      
    /*Accordion displays each part of the recipe, allowing to show only each section as needed
      by default, starts with the ingredients list open*/
        <Accordion
          defaultActiveKey="0"
          flush="true">
          <Accordion.Item eventKey="0">
            
            <Accordion.Header className="fullwidth">Ingredients</Accordion.Header>
            
            <Accordion.Body className="accordion">
               <ListGroup>
                 {/*Checks if ingredients list is not null before mapping the array into list items*/}
                 <div className="listitem">
                  { this.props.ingredients != null && this.props.ingredients.extendedIngredients.map(( ingredient, index ) => (
                      <ListGroup.Item key={index}>
                       <div className="listtext">
                         {index+1}: {Math.round(ingredient.measures.metric.amount * 10)/10+" "+ingredient.measures.metric.unitLong+" of "+ingredient.name}
                       </div>
                      </ListGroup.Item>
                  ) )}
                 </div>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="1">
            <Accordion.Header>Detailed Instructions</Accordion.Header>
            <Accordion.Body className="accordion">
              {/*This checks if both instructions and steps a defined and not null before attempting to map the full list of instructions*/}
              {
                this.props.instructions[0] !== null && this.props.instructions[0] !== undefined &&
                this.props.instructions[0].steps !== undefined &&
              <>
                <label>{this.props.instructions[0].steps.map(( step, index) => ( <div><p>{index+1}: {step.step}<br></br></p></div> ) ) }</label>
                <br></br>
                {/*Provides a button that loads a secure new tab of the recipe source*/}
                <Button variant="info" href={this.props.ingredients.sourceUrl} target="_blank" rel="noopener noreferrer">Go to recipe source</Button>
              </>
              }
              </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Recipe Card</Accordion.Header>
            {/*Shows recipe card as provided from the API. To_DO Correct the size ratio of this image to be more reasonable*/}
            <Accordion.Body>
              { this.props.card !== null && this.props.card !== undefined &&
                <img width= "auto" height="1000vh" src={this.props.card}></img>
                }
              </Accordion.Body>
          </Accordion.Item>
        </Accordion>
    
      
      )
  }
}

/*Standard class to manage errors that can occur from compononents smoothly to avoid crashing the whole site*/
  class ErrorBoundary extends React.Component
  {
    constructor(props)
    {
      super(props);
      this.state = { hasError: false };
    }
    
    static getDerivedStateFromError( error )
    {
      return {hasError: true };
    }
    
    componentDidCatch( error, errorInfo )
    {
      console.log( error.message, errorInfo );
    }
    
    render()
    {
      if( this.state.hasError)
      {
        return <h1>We have encountered an error... oops</h1>
      }
      
      return this.props.children;
    }

  }

/*Retired functions and components that may be reintroduced with future changes in the API

this.state = 
    {
      ingredientList: [],
      id: 1
    };
    this.buildIngredientList = this.buildIngredientList.bind(this);
  }
  
  //extracts the details of the ingredients
  buildIngredientList()
  {
    if( this.props.instructions[0] !== null && this.props.instructions[0] !== undefined )
    {
      var newArray = this.state.ingredientList;
      const stepCount = this.props.instructions[0].steps.length;
      for( var i=0; i < stepCount; i++ )
      {
        var stepIngredients = this.props.instructions[0].steps[i].ingredients;
        for( var j = 0; j < stepIngredients.length > 0; j++ )
        {
          if( !newArray.includes( stepIngredients[j].name ) )
          {//ingredient hasn't already been added to array, add it
            newArray.push(stepIngredients[j].name)
            console.log( "Added Ingredient " + stepIngredients[j].name );
          }
        }
      }
      this.setState({ ingredientList : newArray } );
    }
  }
  
  //Check if a new recipe selected
    if( this.state.id !== this.props.id)
    {
      this.buildIngredientList();
      this.setState({ id: this.props.id });
      console.log( "Card URL is " + this.props.card );
    }
    





{this.state.instructions[0].steps.map(( step, index) => ( <div><p>step number: {index} </p><br></br></div> ) ) }
{//this.state.instructions[0].step}
 <ListGroup>
                
                this.state.instructions.steps.map(( step, index ) => (
                  <ListGroup.Item variant="primary">
                    <label>{step.step}</label>
                  </ListGroup.Item>
                ))
            }
              </ListGroup>  
              
              
    this.state.ingredientList.map(( ingredient, index ) => (
                  <ListGroup.Item key={index}>
                      {index+1}: {ingredient}
                  </ListGroup.Item>
              ) )
              
              
              <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="Recipe">Show this recipe</Tooltip>}
                  >
                  
                   </OverlayTrigger>
            
*/
