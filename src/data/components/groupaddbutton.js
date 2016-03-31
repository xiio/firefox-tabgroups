const GroupAddButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    onDrop: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      draggingOver: false
    };
  },

  render: function() {
    let buttonClasses = classNames({
      draggingOver: this.state.draggingOver,
      group: true
    });

    return (
      React.DOM.li(
        {
          className: buttonClasses,
          onClick: this.handleClick,
          onDrop: this.handleDrop,
          onDragOver: this.handleGroupDragOver,
          onDragEnter: this.handleDragEnter,
          onDragLeave: this.handleDragLeave
        },
        React.DOM.span(
          {className: "group-title"},
          addon.options.l10n.add_group
        )
      )
    );
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.onClick();
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();

    this._dragDropCounter++;
    this.setState({draggingOver: true});
  },

  handleDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();

    this._dragDropCounter--;
    if (this._dragDropCounter === 0) {
      this.setState({draggingOver: false});
    }
  },

  handleDrop: function(event) {
    event.stopPropagation();

    this.setState({draggingOver: false});
    this._dragDropCounter = 0;

    var sourceGroup = event.dataTransfer.getData("tab/group");
    var tabIndex = event.dataTransfer.getData("tab/index");

    this.props.onDrop(
      sourceGroup,
      tabIndex
    );
  },

  _dragDropCounter: 0

});
