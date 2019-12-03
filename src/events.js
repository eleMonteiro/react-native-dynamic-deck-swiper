import { Animated } from 'react-native';

import { createAnimatedEvent } from './animations';

export const onDimensionsChange = (forceUpdate) => {
  forceUpdate();
};

export const onPanResponderMove = (
  {
    horizontalSwipe,
    verticalSwipe,
    horizontalThreshold,
    verticalThreshold,
    onSwiping,
    onTapCardDeadZone,
    overlayOpacityHorizontalThreshold,
    overlayOpacityVerticalThreshold
  },
  { pan: { x: panX, y: panY } },
  animatedValueX,
  animatedValueY
) => (event, gestureState) => {
  onSwiping(animatedValueX, animatedValueY);

  if (!overlayOpacityHorizontalThreshold) {
    overlayOpacityHorizontalThreshold = horizontalThreshold;
  }
  if (!overlayOpacityVerticalThreshold) {
    overlayOpacityVerticalThreshold = verticalThreshold;
  }

  let isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom;

  if (
    Math.abs(animatedValueX) > Math.abs(animatedValueY) &&
    Math.abs(animatedValueX) > overlayOpacityHorizontalThreshold
  ) {
    if (animatedValueX > 0) isSwipingRight = true;
    else isSwipingLeft = true;
  } else if (
    Math.abs(animatedValueY) > Math.abs(animatedValueX) &&
    Math.abs(animatedValueY) > overlayOpacityVerticalThreshold
  ) {
    if (animatedValueY > 0) isSwipingBottom = true;
    else isSwipingTop = true;
  }

  let stateUpdates = {};
  if (isSwipingRight) {
    stateUpdates.labelType = LABEL_TYPES.RIGHT;
  } else if (isSwipingLeft) {
    stateUpdates.labelType = LABEL_TYPES.LEFT;
  } else if (isSwipingTop) {
    stateUpdates.labelType = LABEL_TYPES.TOP;
  } else if (isSwipingBottom) {
    stateUpdates.labelType = LABEL_TYPES.BOTTOM;
  } else {
    stateUpdates = LABEL_TYPES.NONE;
  }

  if (
    animatedValueX < -onTapCardDeadZone ||
    animatedValueX > onTapCardDeadZone ||
    animatedValueY < -onTapCardDeadZone ||
    animatedValueY > onTapCardDeadZone
  ) {
    stateUpdates.slideGesture = true;
  }

  return [
    stateUpdates,
    Animated.event([
      null,
      createAnimatedEvent(horizontalSwipe, verticalSwipe, panX, panY)
    ])(event, gestureState)
  ];
};

export const onPanResponderGrant = (
  { dragStart },
  { pan, panResponderLocked },
  animatedValueX,
  animatedValueY
) => (event, gestureState) => {
  dragStart && dragStart();
  if (!panResponderLocked) {
    pan.setOffset({
      x: animatedValueX,
      y: animatedValueY
    });
  }

  pan.setValue({
    x: 0,
    y: 0
  });
};

validPanResponderRelease = (
  { disableBottomSwipe, disableLeftSwipe, disableRightSwipe, disableTopSwipe },
  { isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom }
) => {
  // const {
  //   isSwipingLeft,
  //   isSwipingRight,
  //   isSwipingTop,
  //   isSwipingBottom
  // } = this.getSwipeDirection(this._animatedValueX, this._animatedValueY);

  return (
    (isSwipingLeft && !disableLeftSwipe) ||
    (isSwipingRight && !disableRightSwipe) ||
    (isSwipingTop && !disableTopSwipe) ||
    (isSwipingBottom && !disableBottomSwipe)
  );
};

export const onPanResponderRelease = (
  { dragEnd, horizontalThreshold, verticalThreshold, onTapCard } = props,
  { firstCardIndex, pan, panResponderLocked, slideGesture },
  _animatedValueX,
  _animatedValueY,
  getOnSwipeDirectionCallback,
  getSwipeDirection,
  resetTopCard,
  setState,
  swipeCard
) => (e, gestureState) => {
  dragEnd && dragEnd();
  if (panResponderLocked) {
    tpan.setValue({
      x: 0,
      y: 0
    });
    pan.setOffset({
      x: 0,
      y: 0
    });
    return;
  }

  const animatedValueX = Math.abs(_animatedValueX);
  const animatedValueY = Math.abs(_animatedValueY);

  const isSwiping =
    animatedValueX > horizontalThreshold || animatedValueY > verticalThreshold;

  if (
    isSwiping &&
    validPanResponderRelease(
      props,
      getSwipeDirection(_animatedValueX, _animatedValueY)
    )
  ) {
    const onSwipeDirectionCallback = getOnSwipeDirectionCallback(
      _animatedValueX,
      _animatedValueY
    );

    swipeCard(onSwipeDirectionCallback);
  } else {
    resetTopCard();
  }

  if (!slideGesture) {
    onTapCard(firstCardIndex);
  }

  setState({
    labelType: LABEL_TYPES.NONE,
    slideGesture: false
  });
};