import './App.css';
import React, {Component} from 'react';

import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMsg: '',
      numParents: 3,
      numBlocks: 4,
    };
  }

  onFileChange = fileName => {
    return event => {
      this.setState({ [fileName]: event.target.files[0] });
    };
  };

  handleNumChange = numID => {
    return event => this.setState({[numID]: event.target.value})
  };

  getFileText = async file => {
    return new Promise((resolve,  reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  };
    

  onRunStart = async () => {
    let parentsPromise = this.getFileText(this.state.parentsFile);
    let pdbPromise = this.getFileText(this.state.pdbFile);
    let [parentsText, pdbText] = await Promise.all([
        parentsPromise.catch(error => {this.setState({errorMsg: 'Add a parents file.'})}),
        pdbPromise.catch(error => {this.setState({errorMsg: 'Add a pdb file.'})}),
    ]);
    let numParents = this.state.numParents;
    let numBlocks = this.state.numBlocks;

    // placeholders for http call
    console.log("Sending these things:");
    console.log(parentsText);
    console.log(pdbText);
    console.log(numParents);
    console.log(numBlocks);

    let run_params = {parentsText, pdbText, numParents, numBlocks};
    console.log(run_params);

    // TODO: Uncomment when backend can accept requests.
    /*
    axios.post("<BACKEND URL>", run_params)
      .then(response => {
        console.log(response);
        console.log(response.data);
      });
    */
  };

  render() {

    return (
      <div className="App">
        <div>
          <h3> Upload parent alignment FASTA: </h3>
          <input type="file" onChange={this.onFileChange("parentsFile")} />
        </div>

        <div>
          <h3> Upload PDB file: </h3>
          <input type="file" onChange={this.onFileChange("pdbFile")} />
        </div>

        <div>
          <h3> Number of parents: </h3>
          <input id="numParents" type="number" value={this.state.numParents} onChange={this.handleNumChange("numParents")} min="2" max="6"/>
        </div>

        <div>
          <h3> Number of blocks: </h3>
          <input id="numBlocks" type="number" value={this.state.numBlocks} onChange={this.handleNumChange("numBlocks")} min="2" max="8"/>
        </div>

        <button onClick={this.onRunStart}>
          Upload
        </button>

        {this.state.errorMsg && <h1> {'Error: ' + this.state.errorMsg} </h1> }
      </div>
    );
  }
}

export default App;
