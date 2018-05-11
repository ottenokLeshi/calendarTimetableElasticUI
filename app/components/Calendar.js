import 'react-big-calendar/lib/css/react-big-calendar.css';
import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import xml2js from 'xml2js';
import { PassThrough } from 'stream';

const parser = new xml2js.Parser().parseString

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class MyCalendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      myEvents : [],
      profileOrError: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.myEvents !== prevState.myEvents) {
      return {
        myEvents : [],
        profileOrError: null,
      };
    }

    return null;
  }

  componentDidMount() {
    this._getEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.profileOrError === null) {
      this._getEvents();
    }
  }

  render() {
    if (this.state.profileOrError === null) {
      return (
        <div>Loading...</div>
      )
    } else {
      return (
        <div >
          <BigCalendar
            views={['month', 'week', 'day']}
            defaultView="week"
            step={60}
            events={this.state.myEvents}
            defaultDate={new Date(2017, 8, 4)}
            showMultiDayTimes
          />
        </div>
      );
    }
  }


  createDate(str) {
    const [data, time] = str.split(" ");
    const [month, day, year] = data.split("/")
    const [hour, minutes, seconds] = time.split(":")
    return new Date(year, month - 1, day, hour, minutes, seconds);
  }

  _getEvents() {
    let url = "";
    if (this.props.state.groupName !== "") {
      url +=  `name:"${this.props.state.groupName}\"`;
    }
    if (this.props.state.educator !== "") {
      if (url !== "") url += ' AND ';
      url +=  `educatorsdisplaytext:\"${this.props.state.educator}\"`;
    }
    console.log(this.props)
    console.log(`http://localhost:9200/timetable/_search?q=${url}&size=10000`)
    this.state
    return fetch(`http://localhost:9200/timetable/_search?q=${url}&size=10000`)
      .then(response => response.json())
      .then(data => {
        const newData = data.hits.hits.filter(element => element._source.recurrenceinfo !== null ).map(elem => {
            parser(elem._source.recurrenceinfo, function (err, result) {
            elem._source.recurrenceinfo = result.RecurrenceInfo.$;
          });
          return elem;
        }).filter(element => typeof element._source.recurrenceinfo.Start !== 'undefined' )
        const events = newData.map(event => {
          const startTime = event._source.recurrenceinfo.Start;
          return {
            id: event._id,
            title: event._source.subject,
            desc: event._source.locationsdisplaytext + " \n" + event._source.educatorsdisplaytext,
            start: this.createDate(startTime),
            end: this.createDate(startTime.split(" ")[0] + " " + event._source.recurrenceinfo.End.split(" ")[1]),
          }
        })
        return this.setState(this.setState(Object.assign({}, this.state, {myEvents: events, profileOrError: true})));
      });
  }
};

export default MyCalendar;
