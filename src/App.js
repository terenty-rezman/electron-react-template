import React from 'react'

// to debug renderer process with vscode follow 
// https://blog.matsu.io/debug-electron-vscode

const fs = require('fs');
console.log(fs.readdirSync('/'));

const App = () => {
  return (
    <div className='container'>
      <h1>electron-react-template</h1>
      <div>with hot reload</div>
      <div>and node api access from electron renderers</div>
      <h3>node version: {process.versions.node}</h3>
    </div>
  );
}

export default App