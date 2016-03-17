const store = Redux.createStore(Reducer);

const Actions = {
  addGroup: function() {
    addon.port.emit("Group:Add");
  },

  closeGroup: function(groupID) {
    addon.port.emit("Group:Close", {groupID});
  },

  uiHeightChanged: function() {
    addon.port.emit("UI:Resize", {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });
  },

  renameGroup: function(groupID, title) {
    addon.port.emit("Group:Rename", {groupID, title});
  },

  selectGroup: function(groupID) {
    addon.port.emit("Group:Select", {groupID});
  },

  dropOnGroup: function(sourceGroupID, tabIndex, targetGroupID) {
    addon.port.emit("Group:Drop", {sourceGroupID, tabIndex, targetGroupID});
  },

  selectTab: function(groupID, tabIndex) {
    addon.port.emit("Tab:Select", {groupID, tabIndex});
  },

  dragTab: function(groupID, tabIndex) {
    addon.port.emit("Tab:Drag", {groupID, tabIndex});
  },

  dragTabStart: function(groupID, tabIndex,tab ) {
    addon.port.emit("Tab:DragStart", {groupID, tabIndex, tab});
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider,
      {store: store},
      React.createElement(App, {
        onGroupAddClick: Actions.addGroup,
        onGroupClick: Actions.selectGroup,
        onGroupDrop: Actions.dropOnGroup,
        onGroupCloseClick: Actions.closeGroup,
        onGroupTitleChange: Actions.renameGroup,
        onTabClick: Actions.selectTab,
        onTabDrag: Actions.dragTab,
        onTabDragStart: Actions.dragTabStart,
        uiHeightChanged: Actions.uiHeightChanged
      })
    ),
    document.getElementById("content")
  );
});

addon.port.on("Groups:Changed", (tabgroups) => {
  store.dispatch(ActionCreators.setTabgroups(tabgroups));
});
