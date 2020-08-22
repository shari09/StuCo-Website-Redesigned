/** @jsx jsx */
import React, {useContext, useRef, useEffect, useState} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Heading} from '../components/Heading';
import {Collapsable} from '../components/Collapsable';
import {theme} from '../utils/theme';
import {IInfoContext, InfoContext} from '../utils/contexts';
import {BsThreeDots, BsSearch} from 'react-icons/bs';
import {getImageUrl, randNum, randInt} from '../utils/functions';
import {Club} from '../utils/interfaces';
import clubBackground from '../assets/clubBackground.png';
import ResizeObserver from 'resize-observer-polyfill';
import { ClubPopup } from '../components/ClubPopup';

//x1, y1 - top middle
//x2, y2 - bottom left
//x3, y3 - bottom right
class BgTriangleProp {
  private x1: string;
  private y1: string;
  private x2: string;
  private y2: string;
  private x3: string;
  private y3: string;
  private style: SxStyleProp = {};

  constructor(x1, y1, x2, y2, x3, y3, style: SxStyleProp) {
    this.x1 = x1;
    this.x2 = x2;
    this.x3 = x3;
    this.y1 = y1;
    this.y2 = y2;
    this.y3 = y3;
    this.style = style;
  }

  public getStyle = () => this.style;

  public getClipPath = () => {
    return `polygon(${this.x1} ${this.y1}, ${this.x2} ${this.y2}, ${this.x3} ${this.y3})`;
  };
}

export const Clubs: React.FC = () => {
  const {clubs, clubHighlights} = useContext<IInfoContext>(InfoContext);
  const [height, setHeight] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [popupClub, setPopupClub] = useState<Club>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const bgRectWidth = useRef<number[]>([]);
  const bgTriangleProp = useRef<BgTriangleProp[]>([]);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setHeight(entry.target.clientHeight);
      });
    });
    ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, []);

  if (!clubs || !clubHighlights) {
    return <React.Fragment />;
  }

  /**
   * Gets the list of clubs
   */
  const getClubList = () => {
    const categories = {};
    clubs.forEach((club) => {
      if (categories[club.category]) {
        categories[club.category].push(club);
      } else {
        categories[club.category] = [club];
      }
    });


    const getClubs = (category) => {
      return categories[category].map((club) => {
        return (
          <div onClick={() => {
            setPopupClub(club);
            setIsPopup(true);
          }}>
            {club.name}
          </div>
        );
      });
    };

    return Object.keys(categories).map((category, index) => {
      const titleStyle: SxStyleProp = {
        color: theme.colors.text.darkGray,
        borderColor: theme.colors.text.darkGray,
        fontSize: theme.fontSizes.bodyBig,
        fontFamily: theme.fonts.body,
      };
      const childrenStyle: SxStyleProp = {
        color: theme.colors.text.darkSlate,
        borderColor: theme.colors.text.darkSlate,
        ml: ['10%', '80%', '80%'],
        pl: '1em',
        fontSize: theme.fontSizes.bodySmall,
        width: '100%',
        '&:hover': {
          cursor: 'pointer',
        },
      };
      const titleWrapper: SxStyleProp = {
        textAlign: ['left', 'right', 'right'],
      };
      const titleComponent = (
        <div sx={titleWrapper}>
          {category} <BsThreeDots />
        </div>
      );

      return (
        <Collapsable
          title={titleComponent}
          titleStyle={titleStyle}
          childrenStyle={childrenStyle}
          collapsed={index === 0 ? false : true}
        >
          {getClubs(category)}
        </Collapsable>
      );
    });
  };

  //=================================================
  //querying
  const getSearchResult = (searchStr: string) => {
    return clubs.filter((club) => {
      if (!club.name) return false;
      return club.name.toLowerCase().includes(searchStr.toLowerCase());
    });
  };

  const displaySearchResults = () => {
    const wrapperStyle: SxStyleProp = {
      display: 'flex',
      flexDirection: 'column',
      mx: 'auto',
    };
    const style: SxStyleProp = {
      color: theme.colors.text.darkGray,
      borderColor: theme.colors.text.darkGray,
      fontSize: theme.fontSizes.bodyBig,
      fontFamily: theme.fonts.body,
      padding: '0.3em',
      zIndex: 2,
      display: 'block',
      margin: 'auto',
      '&:hover': {
        cursor: 'pointer',
      },
    };
    const results = getSearchResult(query).map((club) => {
      return (
        <div sx={style} onClick={() => {
          setPopupClub(club);
          setIsPopup(true);
        }}>
          {club.name}
        </div>
      );
    });

    return <div sx={wrapperStyle}>{results}</div>;
  };

  //=================================================
  //background decorations
  const getTransluteRects = () => {
    const getStyle = (i) => {
      const style: SxStyleProp = {
        position: 'absolute',
        height: ['50%', '20%'],
        top: (i + 1) * 200,
        width: ['90%', '70%', `${bgRectWidth.current[i]}%`],
        backgroundColor: theme.colors.background.overlay,
        right: `${0}%`,
        zIndex: 0,
      };
      return style;
    };

    return Array.from(new Array(Math.floor(height / 250)).keys()).map((i) => {
      if (!bgRectWidth.current[i]) bgRectWidth.current.push(randNum(5, 55));
      return <div sx={getStyle(i)} />;
    });
  };

  const getTriangleImages = () => {
    const getStyle = (i: number) => {
      const imageUrl = getImageUrl(
        clubHighlights[i % clubHighlights.length].photoId,
        400,
        400,
      );
      const style: SxStyleProp = {
        zIndex: 0,
        backgroundColor: theme.colors.secondary,
        backgroundImage: `url(${imageUrl})`,
        clipPath: bgTriangleProp.current[i].getClipPath(),
        ml: 'auto',
        ...bgTriangleProp.current[i].getStyle(),
        backgroundSize: 'cover',
      };
      return style;
    };

    const triangles = Array.from(new Array(Math.floor(height / 250)).keys()).map((i) => {
      if (!bgTriangleProp.current[i]) {
        bgTriangleProp.current.push(
          new BgTriangleProp(
            `${randInt(40, 55)}%`,
            0,
            0,
            `${randInt(60, 100)}%`,
            '100%',
            `${randInt(30, 100)}%`,
            {
              width: `${randInt(7, 15)}vmax`,
              height: `${randInt(7, 15)}vmax`,
              mr: `${randInt(20, 50)}%`,
              my: `${randInt(2, 7)}%`,
            },
          ),
        );
      }
      return <div sx={getStyle(i)} />;
    });

    const wrapper: SxStyleProp = {
      width: ['30%', '40%'],
      top: '40%',
      right: 0,
      position: 'absolute',
      zIndex: 0,
    };

    return <div sx={wrapper}>{triangles}</div>;
  };

  //=================================================
  //styles

  const wrapperStyle: SxStyleProp = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
    display: 'flex',
    flexWrap: 'wrap',
    ...theme.bodyPadding,
  };

  const clubListWrapper: SxStyleProp = {
    display: 'block',
    ml: [0, '10%', '30%'],
    zIndex: 2,
  };
  const lineStyle: SxStyleProp = {
    backgroundColor: theme.colors.secondary,
    height: 2,
    width: '100%',
    borderRadius: 2,
    my: '0.5em',
  };

  const backgroundImgStyle: SxStyleProp = {
    position: 'absolute',
    top: height * 0.4,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: height * 0.6,
    zIndex: 1,
  };

  const searchBoxStyle: SxStyleProp = {
    height: '1.3em',
    borderRadius: 15,
    borderColor: theme.colors.searchBox.darkGray,
    borderWidth: 1,
    py: '1em',
    px: '0.5em',
    fontSize: theme.fontSizes.bodySmall.map((n) => n + 5),
    fontFamily: theme.fonts.body,
    '&:focus': {
      borderWidth: 1.5,
      outline: 'none',
    },
  };

  const searchBoxWrapperStyle: SxStyleProp = {
    position: 'relative',
    width: ['100%', '40%', '20%'],
    marginLeft: 'auto',
    my: 'auto',
    fontSize: theme.fontSizes.bodySmall.map((n) => n + 5),
  };
  const iconStyle: SxStyleProp = {
    position: 'absolute',
    right: 0,
    top: '0.5em',
  };

  //==============================================================
  //render

  return (
    <div sx={wrapperStyle} ref={pageRef}>
      <img src={clubBackground} sx={backgroundImgStyle} />
      {getTransluteRects()}

      <Heading
        text="Clubs"
        alignment="left"
        underline={false}
        extraStyling={{display: 'inline', my: 'auto'}}
      />

      <div sx={searchBoxWrapperStyle}>
        <input
          sx={searchBoxStyle}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search"
        />
        <BsSearch sx={iconStyle} />
      </div>

      <div sx={lineStyle} />
      {query === '' ? (
        <div sx={clubListWrapper}>{getClubList()}</div>
      ) : (
        displaySearchResults()
      )}

      {getTriangleImages()}

      {isPopup && popupClub
       ? <ClubPopup
          closeHandler={() => setIsPopup(false)}
          clubInfo={popupClub}
        />
       : undefined
      }

    </div>
  );
};
