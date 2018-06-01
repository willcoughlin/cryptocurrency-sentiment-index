import React from 'react';
import './NavBar.css';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.tickers[0],
      expanded: false
    };
  }

  componentDidMount() {
    this._setActiveItem(this.state.selected);
    window.addEventListener('scroll', this._scrollSpy.bind(this));
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-light fixed-top">
        <button name="Back to Top" className="btn btn-link navbar-brand mb-0 h1" onClick={() => this._smoothScroll(0)}>
          <span className="d-none d-sm-block">Cryptocurrency Sentiment Index</span>
          <span className="d-sm-none">CCSI</span>
        </button>
        {/* Nav button that will show on narrow screens */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" onClick={this._handleNavBarTogglerClick.bind(this)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Nav items that will show on wider screens */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {this.props.tickers.map(t => {
              return (
                <li className="nav-item text-center" key={'link-' + t}>
                  <button className="nav-link btn btn-link btn-outline-secondary" id={'link-' + t} onClick={this._handleNavItemClick.bind(this)}>
                    <span>{t}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }

  /* navbar-toggler click handler */
  _handleNavBarTogglerClick(e) {
    const menuId = e.target.getAttribute('data-target').substring(1);
    const menu = document.getElementById(menuId);
    const toggle = (this.state.expanded ? menu.classList.remove : menu.classList.add).bind(menu.classList);
    toggle('show');
    this.setState({ expanded: !this.state.expanded });
  }

  /* nav-item click event handler */
  _handleNavItemClick(e) {
    const id = e.target.id.split('-')[1];
    this._setActiveItem(id);
    const collapse = document.getElementById('navbarNav');
    if (collapse.classList.value.includes('show')) {
      collapse.classList.remove('show');
      this.setState({ expanded: false });
    }
    
    this._smoothScroll(this._getCardTop(id))
  }

  /* Used to class the navbar links and update component state */
  _setActiveItem(id) {
    const oldActive = document.getElementById('link-' + this.state.selected).parentNode;
    const newActive = document.getElementById('link-' + id).parentNode;
    oldActive.classList.remove('active');
    oldActive.firstElementChild.classList.remove('btn-outline-primary');
    oldActive.firstElementChild.classList.add('btn-outline-secondary');
    
    newActive.classList.add('active');
    newActive.firstElementChild.classList.remove('btn-outline-secondary');    
    newActive.firstElementChild.classList.add('btn-outline-primary');
    
    this.setState({selected: id});
  }

  /* Watch position when scrolling to set active item */
  _scrollSpy() {
    for (const t of this.props.tickers) {
      if (this._getCardTop(t) < window.pageYOffset + 50) {
        this._setActiveItem(t);
      }
    }
  }

  /* Get top of a given item */
  _getCardTop(id) {
    const card = document.getElementById(id);
    const cardTop = card.getBoundingClientRect().top;
    return cardTop + window.scrollY - 76;
  }

  _smoothScroll(pos) {
    window.scroll({top: pos, left: 0, behavior: 'smooth'});
  }
}

export default NavBar;