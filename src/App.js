import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { fetchFromServer } from './actions/fetch';
import './App.css';

class App extends Component {
  initSearch = (e) => {
    e.preventDefault();

    const { value } = this.input;

    if (value && value.length !== 0) {
      this.fetchHits(value, 0);
    }
  }

  paginateSearch = (e) => this.fetchHits(this.input.value, this.props.page + 1);

  fetchHits = (value, page) =>  {
    this.props.fetchFromServer(value, page);
  }

  render() {
    return (
      <div className="page">
        <div className="interactions">
          <form type="submit" onSubmit={this.initSearch}>
            <input type="text" ref={node => this.input = node} />
            <button type="submit">Search From Hacker News</button>
          </form>
        </div>

        <PaginatedList {...this.props} paginateSearch={this.paginateSearch} />
      </div>
    );
  }
}

const List = (props) => {
  return (
    <div className="list">
    {props.hits.map(item => <div className="list-row" key={item.created_at_i}>
      <a href={item.url}>{item.title}</a>
    </div>)}
    </div>
  );
};


const withLoading = (conditionFn) => (Component) => (props) => {
  return (
    <div>
    <Component {...props} />

    <div className="interactions">
      {conditionFn(props) && <span>Loading...</span>}
    </div>
  </div>
  );
}


const ErrorComponent = (conditionFn) => (Component) => (props) => {
  return (
    <div>
    <Component {...props} />

    <div className="interactions">
      {
        conditionFn(props) &&
        <div>
          <div>
            Fetching goes wrong...
          </div>
          <button
            type="button"
            onClick={props.paginateSearch}
          >
            Try Again
          </button>
        </div>
      }
    </div>
  </div>
  );
}

const PaginatedScroll = (conditionFn) => (Component) =>
  class PaginatedScroll extends React.Component {
    componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => conditionFn(this.props) && this.props.paginateSearch();

    render() {
      return <Component {...this.props} />;
    }
  }
  
const isPaginated = props => props.page !== null && !props.isLoading && props.isError;

const isScrolling = props =>
  (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
  && props.hits.length
  && !props.isLoading
  && !props.isError;

const isLoading = props => props.isLoading;

const PaginatedList = compose(
  ErrorComponent(isPaginated),
  PaginatedScroll(isScrolling),
  withLoading(isLoading)
)(List);

const mapStateToProps = (state) => {
  return { ...state.fetch };
};
 
export default connect(mapStateToProps, { fetchFromServer })(App);
