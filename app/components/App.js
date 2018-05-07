import React, { Component } from 'react';
import MyCalendar from './Calendar';
import {ReactiveBase, SingleList, DataSearch} from '@appbaseio/reactivesearch';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue : "15.Б07-пу"
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
            componentId="SearchFilter"
            dataField={["name"]}
            onValueChange={
              (currentValue) => {
                this.setState({currentValue})
              }
            }
          />
        </ReactiveBase>
        <MyCalendar currentValue = {this.state.currentValue}/>      
      </div>
    );
  }
};

export default App;
