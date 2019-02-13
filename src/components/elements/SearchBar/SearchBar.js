import React, { Component } from 'react';
import './SearchBar.css';
import FontAwesome from 'react-fontawesome';

class SearchBar extends Component {
    state = {
        value: ''
    }
    timeout = null; 
    doSearch =  (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
        clearTimeout(this.timeout);
        this.timeout = setTimeout( () => {
            this.props.callback(this.state.value)
        }, 500);
    } 
  render() {
      const { value } = this.state;
    return (
      <div className="rmdb-searchbar">
        <div className="rmdb-searchbar-content">
            <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
            <input 
            type="text"
            className="rmdb-searchbar-input"
            placeholder="Search"
            onChange={this.doSearch}
            name="value"
            value={value}
            />
        </div>
      </div>
    );
  }
}
export default SearchBar;
