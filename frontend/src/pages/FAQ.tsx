/** @jsx jsx */
import React, {useContext, ReactElement} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Heading} from '../components/Heading';
import {TranslucentRectangle} from '../components/TranslucentRectangle';
import {theme} from '../utils/theme';
import {IInfoContext, InfoContext} from '../utils/contexts';
import {FAQ as FAQInterface} from '../utils/interfaces';

// fun fun interfaces
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

// The function that returns a FAQ object
// it's pretty big though...
export const FAQ: React.FC = (): ReactElement => {
  // Grab the questions
  const faqQuestions: FAQInterface[] = useContext<IInfoContext>(InfoContext)
    .faq;

  // Custom styles!!!!
  const titleText: SxStyleProp = {
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.light,
    wordWrap: 'normal',
    textAlign: 'center',
  };
  const responseText: SxStyleProp = {
    top: '35%',
    position: 'relative',
    color: theme.colors.text.darkSlate,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.body,
    wordWrap: 'normal',
    lineHeight: 1.6,
  };
  const wrapperStyle: SxStyleProp = {
    // the main page div
    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.light,
    // border: '5px solid', //todo
    // borderColor: 'green',
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything
    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // border: '5px solid', //todo
    // borderColor: 'red',
  };
  const headingWrapperStyle: SxStyleProp = {
    // the header div
    left: '5%',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    position: 'relative',
    // border: '5px solid', //todo
    // borderColor: 'pink',
  };

  // For retrieving all the seperate question answers
  const getFaqItems = (faqQuestions: FAQInterface[]) => {
    const faqItems: ReactElement[] = [];
    // yes shari, a for loop
    // i want the index >:(
    for (let i = 0; i < faqQuestions.length; ++i) {
      let styling: SxStyleProp;
      let imageStyling: SxStyleProp | undefined;

      // Change styles for every even list option
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
      let rectStyling: SxStyleProp =
        i % 3 === 0
          ? {
              maxWidth: '95vw',
              backgroundColor: theme.colors.background.overlay,
            }
          : {
              maxWidth: '95vw',
              backgroundColor: theme.colors.background.overlayNoalpha + '00',
            };

      faqItems.push(
        // To squeeze the next list items into the previous ones
        <li key={i} sx={{mb: '-2em'}}>
          <div
            sx={{
              width: '100%',
              // border: '5px solid',
            }}
          >
            <QuestionItem
              question={faqQuestions[i].question}
              extraStyling={{
                ...styling,
                // Get some smaller spacing for the speech div
                ...(i % 2 === 0 ? {left: '5%'} : {right: '5%'}),
              }}
              imageExtraStyling={imageStyling}
            />
            <ResponseItem
              response={faqQuestions[i].answer}
              textExtraStyling={styling}
              rectExtraStyling={rectStyling}
            />
          </div>
        </li>,
      );
    }

    return faqItems;
  };

  // To hold the speech bubble and question
  const QuestionItem: React.FC<QuestionProp> = ({
    question,
    extraStyling,
    imageExtraStyling,
  }): ReactElement => {
    // Yay more styles!!
    const outerWrapperDiv: SxStyleProp = {
      ...extraStyling,
      width: '100%',
      // border: '5px solid',
    };
    const innerWrapperDiv: SxStyleProp = {
      top: '3.5em',
      maxWidth: '95vw', // to make sure the page doesn't scroll to the right
      position: 'relative',
      display: 'inline-block',
      textAlign: 'center',
      // border: '5px solid',
      // borderColor: 'yellow',
      ...extraStyling,
    };
    const textWrapperDiv: SxStyleProp = {
      position: 'absolute',
      top: '12%',
      width: '100%',
      // border: '5px solid',
      // borderColor: 'pink',
    };

    return (
      <div sx={outerWrapperDiv}>
        <div sx={innerWrapperDiv}>
          <img
            src="./assets/speech_bubble.svg"
            alt=""
            sx={{
              maxWidth: '100vh',
              display: 'inline-block',
              ...imageExtraStyling,
            }}
          />
          <div sx={textWrapperDiv}>
            <p sx={titleText}>{question}</p>
          </div>
        </div>
      </div>
    );
  };

  // To hold the response div and rect
  const ResponseItem: React.FC<ResponseProp> = ({
    response,
    textExtraStyling,
    rectExtraStyling,
  }): ReactElement => {
    const textWrapperDiv: SxStyleProp = {
      height: '100%',
      width: '90%',
      maxWidth: '100vw',
      display: 'inline-block',
      // border: '5px solid', //todo: yeet
      // borderColor: 'magenta',
    };
    return (
      // yes i know the rectangles aren't EXACTLY the way it is on the
      // planning xd but this is good enoughhh. it serves its purpose
      // and i can reuse it!!
      <TranslucentRectangle
        lengthX="60em"
        lengthY="40vh"
        extraStyling={{
          ...textExtraStyling,
          ...rectExtraStyling,
          // border: '5px solid'
        }}
      >
        <div sx={textWrapperDiv}>
          <p sx={{...responseText, ...textExtraStyling}}>{response}</p>
        </div>
      </TranslucentRectangle>
    );
  };

  return (
    <div id="top" sx={wrapperStyle}>
      <div sx={innerWrapperStyle}>
        <div sx={headingWrapperStyle}>
          <Heading text="FAQ" alignment="left" />
        </div>
        <div
          sx={{
            flex: 'initial',
            // border: '1px solid', //todo
            // borderColor: 'blue',
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
