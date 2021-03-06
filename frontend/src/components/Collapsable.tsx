/** @jsx jsx */
import React, {useState, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';
import ResizeObserver from 'resize-observer-polyfill';

interface Props {
  title: string | React.ReactElement;
  titleStyle?: SxStyleProp;
  childrenStyle?: SxStyleProp;
  collapsed?: boolean;
  collapseTime?: number;
}

/**
 * ok sift i'm writing comments now so stop judging my uncommented code >:((
 * @description
 * You can put any children inside Collapsable components and it will render them
 * in the collapsible list/tree format
 *
 * @example
 * <Collapsable title='hello'>
 *   You can have text
 *   <OrComponenents sx={withStyle} onClick={andFunctions}/>
 * </Collapsable>
 *
 * //title can be a component as well
 * const myTitle = <span><p>My twitter page</p><TwitterIcon/></span>;
 *
 * <Collapsable title={myTitle}>
 *   //children
 * </Collapsable>
 */
export const Collapsable: React.FC<Props> = ({
  children,
  title,
  titleStyle,
  collapsed = true,
  childrenStyle,
  collapseTime = 0.01,
}) => {
  const [childrenCollapsed, setChildrenCollapsed] = useState<boolean>(
    collapsed,
  );
  const [childrenHeight, setChildrenHeight] = useState<number>(0);
  const childrenRef = useRef<HTMLDivElement>(null);
  const prevHeight = useRef<number>(0);

  useEffect(() => {

    //if the children has children and they resize, normally it won't re-render
    //which is why the oberserver is added
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        prevHeight.current = childrenHeight;
        const {height} = entry.contentRect;
        setChildrenHeight(height);
      });
    });
    ro.observe(childrenRef.current);
    return () => ro.disconnect();
  }, []);

  const wrapperStyle: SxStyleProp = {
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'visible',
    verticalAlign: 'middle',
    color: theme.colors.text.light,
    fill: theme.colors.text.light,
    height: 'auto',
    padding: '0.3em',
    width: 'auto',
  };

  /**
   * gets height difference when resized
   */
  const getHeightDiff = () => {
    const diff = Math.abs(childrenHeight - prevHeight.current);
    if (diff === 0) return childrenHeight;
    return diff;
  };

  const transitionTime = `${getHeightDiff() * collapseTime}s`;

  const childrenWrapperStyle: SxStyleProp = {
    ml: '20%',
    pr: 14,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.text.light,
    borderLeftStyle: 'dashed',
    overflowY: 'hidden',
    height: childrenCollapsed ? 0 : childrenHeight,
    transitionDuration: transitionTime,
    whiteSpace: 'initial'
    
  };

  const defaultTitleStyle: SxStyleProp = {
    width: 'auto',

    '&:hover': {
      cursor: React.Children.count(children) > 0 ? 'pointer' : 'default',
      color: [
        theme.colors.text.light,
        React.Children.count(children) > 0
          ? theme.colors.footer
          : theme.colors.text.light,
      ],
    },
  };

  return (
    <div sx={wrapperStyle}>
      <span
        sx={{...defaultTitleStyle, ...titleStyle}}
        onClick={() => {
          if (React.Children.count(children) === 0) return;
          setChildrenCollapsed((childrenCollapsed) => !childrenCollapsed);
        }}
      >
        {title}
      </span>
      <div
        sx={{...childrenWrapperStyle, ...childrenStyle}}
      >
        <div ref={childrenRef} children={children} />
      </div>
    </div>
  );
};

export default Collapsable;
