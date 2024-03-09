//Part of this code has been "borrowed" from https://github.com/phetsims/bending-light/blob/main/js/common/model/DispersionFunction.ts

const referenceWavelength = 500;

/**
 * Calculates the Sellmeier value for a given wavelength using Sellmeier equation.
 *
 * @param {number} wavelength - The wavelength for which Sellmeier value is to be calculated (nm).
 * @returns {number} - The Sellmeier value for the given wavelength.
 */
function getSellmeierValue(wavelength) {
    wavelength = wavelength * 1E-9; // Convert nm to m
    const L2 = wavelength * wavelength
    const B1 = 1.03961212;
    const B2 = 0.231792344;
    const B3 = 1.01046945;

    // Constants for converting to metric
    const C1 = 6.00069867E-3 * 1E-12; //
    const C2 = 2.00179144E-2 * 1E-12;
    const C3 = 1.03560653E2 * 1E-12;

    // Calculate the Sellmeier value using Sellmeier equation
    return Math.sqrt( 1 + B1 * L2 / ( L2 - C1 ) + B2 * L2 / ( L2 - C2 ) + B3 * L2 / ( L2 - C3 ) );
}

/**
 * Calculate the air index based on the wavelength
 * @param {number} wavelength - The wavelength in meters
 * @returns {number} - The air index
 */
function getAirIndex(wavelength) {
    return 1 +
        5792105E-8 / ( 238.0185 - Math.pow( wavelength * 1E6, -2 ) ) +
        167917E-8 / ( 57.362 - Math.pow( wavelength * 1E6, -2 ) );
}

/*
    With the above formulas, we can calculater the Sellmeier value for a given wavelength and interpolate between them.
 */

/**
 * See class-level documentation for an explanation of this algorithm
 * @param wavelength - wavelength in meters
 */
function getIndexOfRefraction( wavelength, refractiveIndex ) {

    // get the reference values
    const nAirReference = this.getAirIndex( referenceWavelength );
    const nGlassReference = this.getSellmeierValue( referenceWavelength );

    // determine the mapping and make sure it is in a good range
    const delta = nGlassReference - nAirReference;

    // 1 to 2,42 (air to diamond)
    let x = ( refractiveIndex - 1 ) / ( 1 + refractiveIndex * delta );
    //x = Utils.clamp( x, 0, Number.POSITIVE_INFINITY );
    x = Math.max( Math.min( x, 1 ), 0 );

    // take a linear combination of glass and air equations
    return x * this.getSellmeierValue( wavelength ) + ( 1 - x ) * this.getAirIndex( wavelength );
}