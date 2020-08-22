/**@jsx jsx */
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from './theme';

export class RandomDot {
  private size: number;
  private left: number;
  private top: number;
  
  constructor(x: number, y: number, width: number, height: number) {
    this.size = Math.random()*9;
    this.left = Math.random()*width+x;
    this.top = Math.random()*height+y;
  }
  
  public getComponent = () => {
    const dotStyle: SxStyleProp = {
      backgroundColor: theme.colors.yellow,
      borderRadius: 10,
      width: this.size,
      height: this.size,
      left: this.left,
      top: this.top,
      position: 'absolute',
    };
    return <div sx={dotStyle}/>
  };
}