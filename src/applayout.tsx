import * as React from 'react';
import { LoadTestAgents } from "./loadtestagents";
import { Header } from "./header";

export class AppLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: null };
  }

  render() {
    return (
      <div className="AppLayout" style={{margin: '10px', height: '1px' }}>  
        <Header title="Load test agents" message="Manage self provisioned load test agents"></Header>
        <div className="body">
          <div className="content">
            <LoadTestAgents />
          </div>
          <div className="sidebar"></div>      
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}