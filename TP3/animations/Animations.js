/**
 * Animations
 * @brief File that contains easing functions
 */

function easeInOutQuint(animProgress){
    return animProgress < 0.5 ? 16 * Math.pow(animProgress,5) : 1 - Math.pow(-2 * animProgress + 2, 5) / 2
}

function easeInOutSine(animProgress) {
    return -(Math.cos(Math.PI * animProgress) - 1) / 2;
}

function easeInOutBack(animProgress) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    
    return animProgress < 0.5
        ? (Math.pow(2 * animProgress, 2) * ((c2 + 1) * 2 * animProgress - c2)) / 2
        : (Math.pow(2 * animProgress - 2, 2) * ((c2 + 1) * (animProgress * 2 - 2) + c2) + 2) / 2;
}

function easeInOutQuart(animProgress) {
    return animProgress < 0.5 ? 8 * Math.pow(animProgress,4) : 1 - Math.pow(-2 * animProgress + 2, 4) / 2;
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}