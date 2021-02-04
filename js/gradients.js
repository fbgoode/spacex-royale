const minColors = 2;
const maxColors = 5;
const INTERVAL = 20000;
const gradElement1 = document.getElementById("gradients1");
const gradElement2 = document.getElementById("gradients2");
let alternGrad = true;
let workerGrad = null;

const getRandomHex = () =>
	'#000000'.replace(/0/g, () =>
	  (~~(Math.random()*16)).toString(16)) +
	  (~~(Math.random()*4)).toString(16) + // Opacity
	  (~~(Math.random()*16)).toString(16);

const getRandomNumber = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const setGradient = (direction, colors) => {
  const gradientColors = colors.join(', ');
  const gradient = `linear-gradient(${direction}deg, ${gradientColors})`;
  if (alternGrad) {
	gradElement1.style.background = gradient;
	gradElement1.style.opacity = 1;
	gradElement2.style.opacity = 0;
	alternGrad = false;
  } else {
	gradElement2.style.background = gradient;
	gradElement1.style.opacity = 0;
	gradElement2.style.opacity = 1;
	alternGrad = true;
  }
  
}

const randomGradient = () => {
	const direction = getRandomNumber(0, 180);
	const nbColors = getRandomNumber(minColors, maxColors);
	const colors = Array(nbColors).fill().map(getRandomHex);
  	setGradient(direction, colors);
}

const startRandomGradients = () => {
	stopRandomGradients();
	workerGrad = setInterval(randomGradient, INTERVAL);
}

const stopRandomGradients = () => {
	clearInterval(workerGrad);
}

startRandomGradients();
