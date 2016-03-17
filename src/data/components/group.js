const Group = React.createClass({
  propTypes: {
    group: React.PropTypes.object.isRequired,
    onGroupClick: React.PropTypes.func,
    onGroupDrop: React.PropTypes.func,
    onGroupCloseClick: React.PropTypes.func,
    onGroupTitleChange: React.PropTypes.func,
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      editing: false,
      expanded: false,
      draggingOver: false,
      dragSourceGroup: false,
      newTitle: this.getTitle()
    };
  },

  componentDidUpdate: function() {
    this.props.uiHeightChanged && this.props.uiHeightChanged();
  },

  getTitle: function() {
    return this.props.group.title || (
      addon.options.l10n.unnamed_group + " " + this.props.group.id
    );
  },

  render: function() {
    let titleElement;
    if (this.state.editing) {
      titleElement = React.DOM.input(
        {
          type: "text",
          defaultValue: this.getTitle(),
          onChange: (event) => {
            this.setState({newTitle: event.target.value});
          },
          onClick: (event) => {
            event.stopPropagation();
          },
          onKeyUp: this.handleGroupTitleInputKey
        }
      );
    } else {
      titleElement = React.DOM.span({}, this.getTitle());
    }

    let groupClasses = classNames({
      active: this.props.group.active,
      editing: this.state.editing,
      draggingOver: this.state.draggingOver,
      dragSourceGroup: this.state.dragSourceGroup,
      expanded: this.state.expanded,
      group: true
    });

    return (
      React.DOM.li(
        {
          className: groupClasses,
          onClick: this.handleGroupClick,
          onDragOver: this.handleGroupDragOver,
          onDragEnter: this.handleGroupDragEnter,
          onDragLeave: this.handleGroupDragLeave,
          onDrop: this.handleGroupDrop
        },
        React.DOM.span(
          {
            className: "group-title"
          },
          titleElement,
          React.createElement(
            GroupControls,
            {
              editing: this.state.editing,
              expanded: this.state.expanded,
              onClose: this.handleGroupCloseClick,
              onEdit: this.handleGroupEditClick,
              onEditAbort: this.handleGroupEditAbortClick,
              onEditSave: this.handleGroupEditSaveClick,
              onExpand: this.handleGroupExpandClick
            }
          )
        ),
        this.state.expanded && React.createElement(
          TabList,
          {
            tabs: this.props.group.tabs,
            onTabClick: this.props.onTabClick,
            onTabDrag: this.props.onTabDrag,
            onTabDragStart: this.props.onTabDragStart
          }
        )
      )
    );
  },

  handleGroupCloseClick: function(event) {
    event.stopPropagation();
    this.props.onGroupCloseClick(this.props.group.id);
  },

  handleGroupClick: function(event) {
    event.stopPropagation();
    this.props.onGroupClick(this.props.group.id);
  },

  handleGroupEditClick: function(event) {
    event.stopPropagation();
    this.setState({editing: !this.state.editing});
  },

  handleGroupEditAbortClick: function(event) {
    event.stopPropagation();
    this.setState({editing: false});
  },

  handleGroupEditSaveClick: function(event) {
    event.stopPropagation();
    this.setState({editing: false});
    this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
  },

  handleGroupExpandClick: function(event) {
    event.stopPropagation();
    this.setState({expanded: !this.state.expanded});
  },

  handleGroupTitleInputKey: function(event) {
    if (event.keyCode == 13) {
      this.setState({editing: false});
      this.props.onGroupTitleChange(this.props.group.id, this.state.newTitle);
    }
  },

  handleGroupDrop: function(event) {
    event.stopPropagation();

    this.setState({draggingOver: false});
    this._dragDropCounter = 0;

    var source_group = event.dataTransfer.getData('tab/group');
    var tab_index = event.dataTransfer.getData('tab/index');

    this.props.onGroupDrop(
        source_group,
        tab_index,
        this.props.group.id
    );
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  handleGroupDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();

    var source_group = event.dataTransfer.getData('tab/group');
    if (source_group == this.props.group.id){
       this.setState({dragSourceGroup: true});
    } else {
      this.setState({dragSourceGroup: false});
    }

    this._dragDropCounter++;
    this.setState({draggingOver: true});
  },

  handleGroupDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault()

    this._dragDropCounter--;
    if (this._dragDropCounter===0){
      this.setState({draggingOver: false});
    }
  },

  _dragDropCounter: 0

});
