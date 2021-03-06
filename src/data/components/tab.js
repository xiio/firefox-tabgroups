const Tab = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    tab: React.PropTypes.object.isRequired
  },

  render: function() {
    let favicon;
    if (this.props.tab.icon) {
      favicon = React.DOM.img({
        alt: "",
        className: "tab-icon",
        src: this.props.tab.icon
      });
    }

    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true
    });

    return (
      React.DOM.li(
        {
          className: tabClasses,
          onClick: this.handleTabClick
        },
        favicon,
        React.DOM.span({className: "tab-title"}, this.props.tab.title)
      )
    );
  },

  handleTabClick: function(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    this.props.onTabClick(
      tab.group,
      tab.index
    );
  }
});
