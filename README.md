# Prism-Simulation

Prism-Simulation is a JavaScript project that simulates the behavior of light when it interacts with different shapes. It includes features such as light refraction, reflection, and absorption calculations. The project also supports multi-lamp functionality and the ability to rotate objects.

## documentation

If you are interested in the documentation on how this project works, you can take a peek on [https://pws-docs.kronk.tech](https://pws-docs.kronk.tech) (which is fully written in dutch, but you can use Google translate ;) ), only interested in a PDF file, thats right here: [https://pws-docs.kronk.tech/PrismaSimulatie.pdf](https://pws-docs.kronk.tech/PrismaSimulatie.pdf)

## Features

- Light system based on actual mathematics
- Support for different shapes (squares, lines, etc. as long as they have holes)
- Object rotation
- Calculation of the normal of the line on which it hits
- Refraction calculations
- works on mobile and touchscreens
- User settings for various parameters

## Getting Started

To get started download the project and open the `index.html` file in your browser, or visit the [live demo](https://pws.kronk.tech/).
The live demo might not be up-to-date with the latest changes.

## Usage

Detailed usage instructions will be provided as the project progresses.

for now you can use the following functions in the console:
- `user.maxLightCalculations = [number between 0 and ∞]` to set the maximum amount of light calculations
- `s.addShape([shape])` to add a shape to the simulation, possible shapes are:
  - `s.addShape(new Triangle(x, y, width, color));`
  - `s.addShape(new Rectangle(x, y, width, heigth, color));`
  - `s.addShape(new Line(x, y, angle, length, width, color));`
  - `s.addShape(new Circle(x, y, radius, color));`
  - `s.addShape(new Text(x, y, font, color, content));`
- `s.addRay([ray])` to add a ray to the simulation
  - `s.addRay(new Ray(x, y, angle, waveLength, color));`<br>
  wavelength is the wavelength of the light (basically the color)<br>
  color is the color of the lamp itself (not the light)

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).<br>You are free to use, modify, and distribute the code, but please credit me.

## Contact

For any queries or suggestions, please open an issue on GitHub.

**Please note that this project is still a work in progress.**
