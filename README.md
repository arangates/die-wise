# Die Wise

## Overview

The Die Wise is a sophisticated tool designed for semiconductor manufacturing professionals to accurately estimate the number of usable dies per wafer. This project provides an interactive web-based interface that allows users to input various wafer and die parameters, visualize the die layout on a wafer, and calculate key yield metrics.

## Features

- **Interactive Input**: Easily adjust die size, wafer diameter, edge exclusion, and other critical parameters.
- **Real-time Calculation**: Instantly see how parameter changes affect the die yield.
- **Visual Wafer Map**: A color-coded representation of die placement on the wafer, including good, partial, and excluded dies.
- **Yield Estimation**: Calculate the estimated yield based on defect density.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (Button, Input, Select, etc.)
- **Canvas Rendering**: HTML5 Canvas for wafer map visualization

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arangates/die-wise.git
   ```

2. Navigate to the project directory:
   ```bash
   cd die-wise
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser to view the application.

## Usage

1. Enter the die dimensions (width and height) in millimeters.
2. Specify the scribe lane widths (horizontal and vertical).
3. Select the wafer diameter from the dropdown menu.
4. Adjust the edge exclusion zone width.
5. Input the expected defect density.
6. (Optional) Adjust the manual wafer placement shifts.
7. Toggle die centering as needed.
8. View the calculated results and wafer map visualization.
9. Use the "Reset" button to return to default values.

## Key Calculations

- **Good Dies**: Fully usable dies within the productive wafer area.
- **Partial Dies**: Dies that partially fall within the productive area.
- **Excluded Dies**: Dies in the edge exclusion zone.
- **Yield Estimation**: Based on defect density and die area.


## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the needs of semiconductor manufacturing professionals
-Wafer Map Estimation using Murphy’s Model of Die Yield
## Contact

For questions, suggestions, or support, please open an issue in the GitHub repository
