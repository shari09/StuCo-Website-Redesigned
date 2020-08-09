/** @jsx jsx */

import React, {useContext, useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

export interface Item {
  text: string;
  collapsed: boolean;
  children?: Item[];
  topLevel: boolean;
  itemExtraStyling?: SxStyleProp;
  childrenExtraStyling?: SxStyleProp;
  onClicked?: () => void;
}

interface ListProps {
  items: Item[];
  itemExtraStyling?: SxStyleProp;
  childrenExtraStyling?: SxStyleProp;
  onClicked?: () => void;
}

//TODO: make this more scalable, just really not feel like doing it rn,
//very sketchy code pls don't judge 🤪
const ListItem: React.FC<Item> = ({text, collapsed, children, topLevel, itemExtraStyling, childrenExtraStyling, onClicked}) => {
  const [childrenCollapsed, setChildrenCollapsed] = useState<boolean>(true);

  const itemStyle: SxStyleProp = {
    color: theme.colors.text.light,
    fontFamily: theme.fonts.body,
    fontSize: topLevel ? theme.fontSizes.body[5] : theme.fontSizes.body[3],
    borderLeft: topLevel ? 1.5 : 1,
    borderBottom: topLevel ? 1.5 : 1,
    borderRight: 0,
    borderTop: 0,
    borderColor: theme.colors.text.light,
    borderStyle: 'solid',
    display: collapsed ? 'none' : 'block',
    textAlign: 'right',
    width: topLevel ? '40%' : '30%',
    pt: '1.7em',
    ml: topLevel ? '20%' : '40%',
    '&:hover': {
      cursor: children ? 'pointer' : 'default',

    },
  };

  Object.assign(itemStyle, topLevel ? itemExtraStyling : childrenExtraStyling);

  const getChildren = () => {
    if (!children) return;
    return children.map((child) => {
      if (!child.text) return;
      return (
        <ListItem
          text={child.text}
          collapsed={childrenCollapsed}
          children={child.children}
          topLevel={false}
        />
      );
    });
  };

  const textClicked = () => {
    if (!children) return;
    setChildrenCollapsed(!childrenCollapsed);
    // onClicked();
  };

  useEffect(() => {
    if (onClicked) {
      onClicked();
    }
  }, [childrenCollapsed]);

  return (
    <div>
      <div sx={itemStyle} onClick={textClicked}>{text}</div>
      {getChildren()}
    </div>
  );
};

export const CollapsableList = React.forwardRef<HTMLDivElement, ListProps>(
  ({items, itemExtraStyling, childrenExtraStyling, onClicked}, ref) => {
    const getItems = () => {
      return items.map((item) => {
        return (
          <ListItem
            text={item.text}
            collapsed={false}
            children={item.children}
            topLevel={true}
            itemExtraStyling={itemExtraStyling}
            childrenExtraStyling={childrenExtraStyling}
            onClicked={onClicked}
          />
        );
      });
    };

    return <div ref={ref}>{getItems()}</div>;
  },
);

export default CollapsableList;
