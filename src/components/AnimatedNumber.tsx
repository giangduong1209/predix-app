import React from "react";
import { useSpring, animated } from "react-spring";
interface IAnimatedNumberProps {
  startNumber: number;
  endNumber: number;
}

const AnimatedNumber: React.FC<IAnimatedNumberProps> = ({
  startNumber,
  endNumber,
}) => {
  const { number } = useSpring({
    from: { number: startNumber },
    number: endNumber,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });

  return <animated.div>{number.to((n) => n.toFixed(4))}</animated.div>;
};

export default AnimatedNumber;
