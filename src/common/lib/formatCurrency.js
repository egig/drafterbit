import numeral from 'numeral';

numeral.register('locale', 'id', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: 'Rp'
    }
});
numeral.locale('id');

const formatCurrency = function formatCurrency(n) {
    return numeral(n).format('$ 0,0.00');
};

export default formatCurrency;