import styled from 'styled-components'

// Create a Title component that'll render an <h1> tag with some styles
export const Title = styled.h2`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  background-image:
    image-set(
      "./images/icon_red_packet_small.png" 1x,
      "./images/icon_red_packet_small@2x.png" 2x,
      "./images/icon_red_packet_small@3x.png" 3x
    );
`
