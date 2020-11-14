import { CarouselProvider, Image, Slide, Slider } from "pure-react-carousel";
import React from "react";
import { Divider } from "semantic-ui-react";
import CustomDotGroup from "./CustomDotGroup";
const ImageCarousel = () => (
  <CarouselProvider
    naturalSlideWidth={1}
    naturalSlideHeight={0.5}
    interval={7000}
    isPlaying={true}
    playDirection={'backward'}
    totalSlides={3}
  >
    <Slider>
      <Slide tag="a" index={0}>
        <Image  src="https://www.incimages.com/uploaded_files/image/1920x1080/getty_519183570_396172.jpg" />
      </Slide>
      <Slide tag="a" index={1}>
        <Image src="https://miro.medium.com/max/10368/1*xpKbXdbUPCBzFemVGeyrTw.jpeg" />
      </Slide>
      <Slide tag="a" index={2}>
        <Image src="https://miro.medium.com/max/6000/1*vRDcD3NHQYnUk46rZiLH9A.jpeg" />
      </Slide>
    </Slider>
    <Divider />
    <CustomDotGroup slides={3} />
  </CarouselProvider>
);

export default ImageCarousel;
