import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import SSMLMaker from './util/SSMLMaker.js';

const userName = "";
const passWord = "";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.callAPI = this.callAPI.bind(this);
    this._maker = new SSMLMaker();
  }

  handleChange(e) {
    console.log();
    this.setState({ [e.target.name]: e.target.value });
  }

  callAPI() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var ssml = this._maker.createSSML(this.state.text);

    let text = encodeURI(ssml);
    // var style = JSON.stringify({ "a": this.state.emotion })

    let uri = "http://webapi.aitalk.jp/webapi/v2/ttsget.php?username=" + userName + "&password=" + passWord ß+ "&speaker_name=akane_west&ext=mp3&text=" + text;

    fetch(uri).then(function (response) {
      return response.blob();
    })
      .then(async function (blob) {
        return new Promise((resolve, reject) => {
          // var url = window.URL.createObjectURL(blob);
          // var a = document.createElement('a');
          // a.href = url;
          // a.download = "test.mp3";
          // a.click();
          let fileReader = new FileReader();
          let arrayBuffer;

          fileReader.onloadend = () => {
            arrayBuffer = fileReader.result;
            resolve(arrayBuffer);
          }

          fileReader.readAsArrayBuffer(blob);
        });
      })
      .then(async function (arrayBuffer) {
        return new Promise((resolve, reject) => {
          context.decodeAudioData(arrayBuffer, function (decodedData) {
            resolve(decodedData);
          }
          );
        });
      })
      .then(function (decodedData) {
        var source = context.createBufferSource();
        source.buffer = decodedData;
        source.connect(context.destination);
        source.start(0);
      });
  }

  render() {
    return (
      <div className="App">
        {/* <input name="emotion"
          value={this.state.emotion}
          onChange={this.handleChange} /> */}
        <textarea
          name="text"
          value={this.state.text}
          onChange={this.handleChange} />
        <button onClick={this.callAPI}>生成</button>
      </div>
    );
  }
}

export default App;
