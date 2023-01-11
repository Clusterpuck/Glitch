import * as React from "react";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';



export default function HookForms() 
{
  return (
    <div className="fullpage">
      
    <head>
      <meta charset="utf-8"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="../styles/styles.css"></link>
    
    </head>
      
      <body>
        <div className="banner numbersbanner"><h1 className="bannertext">Calculate Your CWA</h1></div>
          <div className="fullpage">

            <br></br>
            <p>
              <strong>Use this page to predict what marks you need to meet your goal CWA.</strong> <br></br>
                  Note weight refers to the percentage points the assessment is worth in the unit
            </p>

            <SemesterForm />

          </div>
        </body>
        </div>
  );
}


//*************Parent*******************//

class SemesterForm extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = { 
                   startCredit: 25,  
                   startCWA: 50,
                   cwa: 0,
                   units: [""],
                   averages: [10] 
                 }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAverageChange = this.handleAverageChange.bind(this);
    this.removeUnit = this.removeUnit.bind(this);
    this.updateUnitName = this.updateUnitName.bind(this);
    this.updateCWA = this.updateCWA.bind(this);
  }
  
    //Adds a unit to the page
  handleSubmit(event)
  {
    if( this.state.units.length < 4 )
    {
      this.setState(
        { 
          units: [ ...this.state.units, ""],
          averages: [ ...this.state.averages, 0]
        })
    }
    this.updateCWA();
    
    event.preventDefault();
  }
  
  updateUnitName( index, event )
  {
    var newUnits = [...this.state.units];
    newUnits[index] = event.target.value;
    this.setState( {
      units: newUnits
    })
  }
  
  updateStartCWA( event )
  {
    this.setState( {
      startCWA: event.target.value
    })
    this.updateCWA();
  }
  
  updateStartCredit( event )
  {
    this.setState( {
      startCredit: event.target.value
    })
    this.updateCWA();
  }
  
  removeUnit( index )
  {
    var newUnits = this.state.units;
    var newAverages = this.state.averages;
    newAverages.splice(index, 1);
    newUnits.splice(index, 1);
    this.setState( 
      { 
        units: newUnits,
        averages: newAverages
      }
    )
    this.updateCWA();
  }
  
  handleAverageChange( ave, index )
  {
    var newAverages = [...this.state.averages];
    newAverages[index] = ave;
    this.setState({ averages: newAverages });
    this.updateCWA();
  }
  
  updateCWA()
  {
    var units = 0;
    var SWA = 0;
    if( this.state.averages !== undefined )
    {
      units = this.state.averages.length
      for( var i = 0; i < this.state.averages.length; i++ )
      {
        SWA += this.state.averages[i];
      }
      if( units > 0 )
      {
        SWA /= units;
      }
    }
    
    //This is the average of all units provided
    //Need to now factor in the CWA from starting amount assuming each unit is worth 25 credits
    //So need new total credits completed and 
    var totalCredits = units*25+this.state.startCredit;
    var newCWA = SWA * ( (units*25)/totalCredits ) + this.state.startCWA*( this.state.startCredit/totalCredits );
    newCWA = Math.round( newCWA * 1000)/1000;
    
    this.setState( { cwa: newCWA })
    
  }

  
  
  render()
  {
    return(
      <div>
        
        <h1>NEW CWA IS {" "}</h1><Button size="lg" variant="info" disabled="true"> {this.state.cwa} </Button><br></br><br></br>
        <Form>
        <Row>
          <Col>
        <div className="label fixedwidthlabel">Starting CWA</div>
                  <div className="fixedwidthlabel">
                    <Form.Control 
                            placeholder="Starting CWA" 
                            type="number"
                            min="0"
                            max="100"
                            value={this.state.startCWA}
                            onChange={ (event) => this.updateStartCWA( event ) }
                          />
                  </div>
          </Col>
          <Col>
                <div className="label fixedwidthlabel">Completed Credits</div>
                  <div className="fixedwidthlabel">
                  <Form.Control 
                          placeholder="Completed Credits" 
                          type="number"
                          min="0"
                          value={this.state.startCredit}
                          onChange={ (event) => this.updateStartCredit( event ) }
                        />
                </div>
          </Col>
          </Row>
        </Form>
        
        
        <div className="unitblock">
          {this.state.units.map((unit,index) => (
            <div>
              <Form>
                <div className="label fixedwidthlabel">Unit Name</div>
                <div className="fixedwidthlabel">
                  <Form.Control
                          placeholder="Unit Name" 
                          value={this.state.units[index]}
                          onChange={ () => this.updateUnitName( index, event ) }
                        />
                </div>
                
              </Form>
              
                <UnitForm
                  unitIndex={index}
                  onAveChange={this.handleAverageChange}
                  units= {this.state.units}
                  removeUnit= {this.removeUnit}
                />
              
            </div>
            ))}
          
          <div>
            
            <Button 
              variant="primary"
              onClick={this.handleSubmit}
              disabled={this.state.units.length >= 4}>
                Add Unit
            </Button>
          </div>
            
        </div>
      </div>
    ) 
  }
}




//*****************Child********************************//

class UnitForm extends React.Component 
{
  constructor(props) {
    super(props);
    this.state = { 
                    assess: [""],
                    marks: [0],
                    weights: [100],
                    average: 0
                 };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearValue = this.clearValue.bind(this);
    this.removeAssessment = this.removeAssessment.bind(this);
    this.updateAssessName = this.updateAssessName.bind(this);
    this.clearUnit = this.clearUnit.bind(this);
  }
   
  clearValue(event) {
    this.setState({ value: "" });
  }
  
  clearUnit( index )
  {
    this.props.removeUnit(index);    
  }
  
    //Adds another assessment to the unit
  handleSubmit(event) 
  {
    if( this.state.assess.length < 5 )
    {
      this.setState({
      assess: [ ...this.state.assess, ""],
      marks: [ ...this.state.marks, 0 ],
      weights: [ ...this.state.weights, 0 ]
        })
    }
    
    event.preventDefault();
  }
  
  
  
  removeAssessment(index)
  {
    
    var newAssess = [...this.state.assess];
    var newMarks = [...this.state.marks];
    var newWeights = [...this.state.weights];
    
    newAssess.splice( index, 1);
    newMarks.splice(index, 1);
    newWeights.splice(index, 1);
    
    this.setState({
      assess: newAssess,
      marks: newMarks,
      weights: newWeights
    })
    this.calculate()
  }
  
  updateMark( index, event )
  {
    var newMarks = [...this.state.marks];
    var thisMark = Number(event.target.value);
    if( thisMark >= 0 && thisMark <= 100 )
    {
      newMarks[index] = thisMark;
      this.setState({ marks: newMarks });
      this.calculate()
      
    }
    
  }
  
  updateAssessName( index, event )
  {
    var newAssess = [...this.state.assess];
    var thisName = event.target.value;
    newAssess[index] = thisName;
      this.setState(
        { 
          assess: newAssess 
        });
  }
  
  updateWeight( index, event )
  {
    var thisWeight = Number(event.target.value);
    var newWeights = this.state.weights;
    if( thisWeight >= 0 && thisWeight <= 100 )
    {
      newWeights[index] = Number(event.target.value);
      this.setState({ weights: newWeights });
      this.calculate()
    }
    
  }
  
  
  
  calculate()
  {
    var average = 0;
    var marks = this.state.marks;
    var weights = this.state.weights;
    
    for( var i = 0; i < marks.length; i++ )
    {
      average = average + ( marks[i]*(weights[i]/100) );
    }
    
    this.setState({ average: average });
    //updates in parent the new average value
    this.props.onAveChange(average, this.props.unitIndex);
    
  }

  
  
  render() 
  {
    const average = this.props.ave;
    const index = this.props.unitIndex;
    return (
     <div>
      <label> Unit Mark <strong> {this.state.average}</strong> </label>
       <form onSubmit={this.handleSubmit}>
         <div className="assessmentblock">
          {//Displays an input for each assessment currently in array
           
            this.state.assess.map((singleAssess,index) => (
            <div className= "markblock">
                <Form>
                  <Row>
                    <Col>
                      <Form.Control 
                        placeholder="Assessment" 
                        value={this.state.assess[index]}
                        onChange={ () => this.updateAssessName( index, event ) }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <div className="buttonblock"> 
                    <Col>
                      <label> Mark </label><br></br>
                      <input type="number" 
                           value={this.state.marks[index]} 
                           placeholder="0"
                           min="0"
                           max="100"
                           style={{width: "5rem", background: "lightgreen" }} 
                           onChange={() => this.updateMark(index, event)}/>
                    </Col>
                    <Col>
                      <label> Weight </label>
                      <input type="number" 
                           value={this.state.weights[index]} 
                           placeholder="0"
                           min="0"
                           max="100"
                           style={{width: "5rem", background: "lightblue"}}
                           onChange={() => this.updateWeight(index, event)}/>
                    </Col>
                    </div>
                  </Row>
                  <Row>
                    <div className="buttonblock"> 
                    
                    { /*Allows to remove for all but the last remaining*/
                      this.state.assess.length !== 1 &&
                      <Button 
                        variant="danger"
                        size="sm"
                        onClick={() => this.removeAssessment(index)} > 
                        Remove Assessment 
                      </Button>
                    }
                    
                      
                    { 
                      /*Allows to add assessment only on last displayed*/ 
                        this.state.assess.length - 1 === index &&
                        
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={this.handleSubmit}>
                          Add Assessment
                        </Button>
                        
                    }
                    </div>
                  </Row>
                </Form> 
            </div>
        ))
             
        }
          </div>
      </form>
          <Button 
            variant="danger"
            disabled={this.props.units.length == 1}
            onClick= { event => this.clearUnit( index )}
          >
                  Remove Unit
          </Button>
      </div>
     
    );
  }
}

