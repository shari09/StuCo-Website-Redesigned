/** @jsx jsx */
import React, {useContext, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

import {Heading} from '../components/Heading';
import {TranslucentRectangle} from '../components/TranslucentRectangle';
import {ScrollToTopButton} from '../components/ScrollToTopButton';

import {theme} from '../utils/theme';
import {IInfoContext, InfoContext} from '../utils/contexts';
import {FAQ as FAQInterface} from '../utils/interfaces';

// Interfaces --
export interface FAQProp {
  question: string;
  answer: string;
  extraStyling?: SxStyleProp;
}

export interface QuestionProp {
  question: string;
  extraStyling?: SxStyleProp;
  imageExtraStyling?: SxStyleProp; // for scaling
}

export interface ResponseProp {
  response: string;
  textExtraStyling?: SxStyleProp;
  rectExtraStyling?: SxStyleProp;
}

//TODO: yes shari i will add padding later
//=====================================================================
// To hold the speech bubble and question
const QuestionItem: React.FC<QuestionProp> = ({
  question,
  extraStyling,
  imageExtraStyling,
}): ReactElement => {
  // Yay more styles!!
  const outerContainerDiv: SxStyleProp = {
    // 'Holds' the inner wrapper, and behaves like a top margin
    width: '100%',

    ...extraStyling,
  };
  const innerWrapperDiv: SxStyleProp = {
    top: '3.5em',
    maxWidth: '95vw', // to make sure the page doesn't scroll to the right
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',

    ...extraStyling,
  };
  const textWrapperDiv: SxStyleProp = {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  const titleTextStyle: SxStyleProp = {
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.light,
    wordWrap: 'normal',
    textAlign: 'center',
    margin: 'auto',
  };
  const imageStyle = {
    maxWidth: '90vw',
    display: 'inline-block',
    ...imageExtraStyling,
  };

  return (
    <div sx={outerContainerDiv}>
      <div sx={innerWrapperDiv}>
        <img src="./assets/speech_bubble.svg" alt="" sx={imageStyle} />
        <div sx={textWrapperDiv}>
          <p sx={titleTextStyle}>{question}</p>
        </div>
      </div>
    </div>
  );
};

//=====================================================================
// ResponseItem holds the response div and rect
const ResponseItem: React.FC<ResponseProp> = ({
  response,
  textExtraStyling,
  rectExtraStyling,
}): ReactElement => {
  const textWrapperDiv: SxStyleProp = {
    position: 'relative',
    display: 'inline-block',

    // TODO: mt is based off width which i find extremely stupid so
    // fix this and make it better
    // to push the wrapper down a bit and make description text readable
    mt: ['20%', '15%', '10%'],
    width: '90%',
  };
  const responseTextStyle: SxStyleProp = {
    position: 'relative',

    color: theme.colors.text.darkSlate,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.body,
    wordWrap: 'normal',
    lineHeight: 1.6,
  };
  const rectStyling: SxStyleProp = {
    minHeight: ['25vh', '30vh', '40vh'],

    ...textExtraStyling,
    ...rectExtraStyling,
  };

  return (
    // yes shari i know the rectangles aren't EXACTLY the way it is on
    // the planning xd but this is good enoughhh. it serves its purpose
    // and i can reuse it!!
    <TranslucentRectangle lengthX="60em" extraStyling={rectStyling}>
      <div sx={textWrapperDiv}>
        <p sx={{...responseTextStyle, ...textExtraStyling}}>{response}</p>
      </div>
    </TranslucentRectangle>
  );
};

//=====================================================================

//=====================================================================
// The function that returns a FAQ object
export const FAQ: React.FC = (): ReactElement => {
  const faqQuestions: FAQInterface[] = useContext<IInfoContext>(InfoContext)
    .faq;

  // Custom styles!!! --
  const wrapperStyle: SxStyleProp = {
    // the main page div

    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything

    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    mb: '14em', // pushing away the footer
  };
  const headingWrapperStyle: SxStyleProp = {
    // the header div

    left: '5%',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    position: 'relative',
  };

  /**
   * Retrieves and formats all the seperate question answers
   * @param faqQuestions - all questions in the faq.
   * @returns a list of ReactElements with the questions.
   */
  const getFaqItems = (faqQuestions: FAQInterface[]) => {
    if (!faqQuestions) {
      return <div></div>;
    }

    return faqQuestions.map((question, i) => {
      let styling: SxStyleProp;
      let imageStyling: SxStyleProp | undefined;

      if (i % 2 === 0) {
        // Left side of the page
        styling = {
          ml: 0,
          mr: 'auto',
          textAlign: 'left',
          left: '5%',
        };
      } else {
        // Right side of the page
        styling = {
          ml: 'auto',
          mr: 0,
          textAlign: 'right',
          right: '5%',
        };
        // For flipping the image
        imageStyling = {transform: 'scaleX(-1)'};
      }

      // Styling the funky transparent rectangle
      const rectStyling: SxStyleProp = {
        maxWidth: '95vw',
        backgroundColor:
          i % 3 === 0 ? theme.colors.background.overlay : 'transparent',
      };

      return (
        <li key={i} sx={{mb: '-2em'}}>
          <div sx={{width: '100%'}}>
            <QuestionItem
              question={faqQuestions[i].question}
              extraStyling={styling}
              imageExtraStyling={imageStyling}
            />
            <ResponseItem
              response={faqQuestions[i].answer}
              textExtraStyling={styling}
              rectExtraStyling={rectStyling}
            />
          </div>
        </li>
      );
    });
  };

  return (
    <div sx={wrapperStyle}>
      {/* initializing scroll to top button */}
      <ScrollToTopButton />

      {/* the faq */}
      <div sx={innerWrapperStyle}>
        <div sx={headingWrapperStyle}>
          <Heading text="FAQ" alignment="left" />
        </div>
        <div
          sx={{
            flex: 'initial',
          }}
        >
          <ul sx={{listStyleType: 'none', px: 0, py: 0, mx: 0, my: 0}}>
            {/* // Getting the list of question-response stuff */}
            {getFaqItems(faqQuestions)}
          </ul>
        </div>
      </div>
    </div>
  );
};
