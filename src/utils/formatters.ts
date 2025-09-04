export const formatCurrency = (
    amount: number, 
    currencyCode: 'ARS' | 'CLP' | 'UYU' | 'MXN' | 'EUR' | 'USD' = 'USD'
) => {
    
    const locale = currencyCode === 'EUR' ? 'es-ES' : 
                   currencyCode === 'ARS' ? 'es-AR' :
                   currencyCode === 'CLP' ? 'es-CL' :
                   currencyCode === 'UYU' ? 'es-UY' :
                   currencyCode === 'MXN' ? 'es-MX' :
                   'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};