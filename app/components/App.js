import React, { Component } from 'react';
import MyCalendar from './Calendar';
import {ReactiveBase, SingleList, DataSearch} from '@appbaseio/reactivesearch';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: "",
      educator: ""
    };
  }

  render() {
    return (
      <div>
        <ReactiveBase
          app="timetable"
          url="http://127.0.0.1:9200/"
        >
          <DataSearch
            componentId="SearchGroup"
            dataField={["name"]}
            onValueChange={
              (currentValue) => {
                this.setState(Object.assign({}, this.state, {groupName: currentValue}))
              }
            }
          />
          <DataSearch
            componentId="SearchEducator"
            dataField={["educatorsdisplaytext"]}
            onValueChange={
              (currentValue1) => {
                this.setState(Object.assign({}, this.state, {educator: currentValue1}))
              }
            }
          />
        </ReactiveBase>
        <MyCalendar state = {this.state}/>      
      </div>
    );
  }
};

export default App;
